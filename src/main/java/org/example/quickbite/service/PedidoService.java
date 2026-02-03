package org.example.quickbite.service;

import org.example.quickbite.dto.request.DetallePedidoFormDTO;
import org.example.quickbite.dto.request.PedidoFormDTO;
import org.example.quickbite.dto.response.PedidoDetalleDTO;
import org.example.quickbite.dto.response.PedidoListaDTO;
import org.example.quickbite.exception.BusinessException;
import org.example.quickbite.exception.ResourceNotFoundException;
import org.example.quickbite.mapper.PedidoMapper;
import org.example.quickbite.model.*;
import org.example.quickbite.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final RepartidorRepository repartidorRepository;
    private final PedidoMapper pedidoMapper;

    private static final int MAX_PEDIDOS_ACTIVOS = 3;
    private static final int MAX_PEDIDOS_EN_CAMINO = 5;

    public Page<PedidoListaDTO> listarTodos(Pageable pageable) {
        log.info("Listando todos los pedidos - Página: {}", pageable.getPageNumber());
        Page<Pedido> pedidos = pedidoRepository.findAll(pageable);
        return pedidos.map(pedidoMapper::toListaDTO);
    }

    public Page<PedidoListaDTO> listarPedidosDelUsuario(Usuario usuario, Pageable pageable) {
        log.info("Listando pedidos del usuario: {}", usuario.getUsername());

        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró un perfil de cliente para este usuario. " +
                                "Por favor, contacta con soporte."
                ));

        Page<Pedido> pedidos = pedidoRepository.findByClienteId(cliente.getId(), pageable);
        return pedidos.map(pedidoMapper::toListaDTO);
    }

    public PedidoDetalleDTO buscarPorId(Long id) {
        log.info("Buscando pedido con ID: {}", id);

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pedido no encontrado con ID: " + id
                ));

        return pedidoMapper.toDetalleDTO(pedido);
    }

    @Transactional
    public PedidoDetalleDTO crearPedidoParaUsuario(Usuario usuario, PedidoFormDTO dto) {
        log.info("Creando pedido para usuario: {}", usuario.getUsername());

        // Buscar cliente por usuario
        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new BusinessException(
                        "No se encontró perfil de cliente para el usuario. Por favor, contacta con soporte."
                ));

        // ACTUALIZAR DIRECCIÓN DEL CLIENTE con los datos del pedido
        if (dto.getDireccionEntrega() != null && !dto.getDireccionEntrega().trim().isEmpty()) {
            cliente.setDireccion(dto.getDireccionEntrega());
            cliente.setCiudad(dto.getCiudadEntrega());
            cliente.setCodigoPostal(dto.getCodigoPostalEntrega());
            cliente.setProvincia(dto.getProvinciaEntrega());
            cliente.setPais(dto.getPaisEntrega() != null ? dto.getPaisEntrega() : "España");
            clienteRepository.save(cliente);
            log.info("Dirección del cliente actualizada: {}", cliente.getDireccion());
        }

        // Verificar límite de pedidos activos
        Long pedidosActivos = pedidoRepository.contarPedidosActivosDelCliente(cliente.getId());
        if (pedidosActivos >= MAX_PEDIDOS_ACTIVOS) {
            throw new BusinessException(
                    String.format("Ya tienes %d pedidos activos. " +
                                    "No puedes realizar más pedidos hasta que se completen los anteriores.",
                            MAX_PEDIDOS_ACTIVOS)
            );
        }

        // VALIDAR QUE TODOS LOS PRODUCTOS SEAN DEL MISMO RESTAURANTE
        Set<Long> restaurantesIds = new HashSet<>();
        for (DetallePedidoFormDTO detalleDTO : dto.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Producto no encontrado con ID: " + detalleDTO.getProductoId()
                    ));
            restaurantesIds.add(producto.getRestaurante().getId());
        }

        if (restaurantesIds.size() > 1) {
            throw new BusinessException(
                    "No puedes pedir productos de diferentes restaurantes en el mismo pedido. " +
                            "Por favor, realiza pedidos separados para cada restaurante."
            );
        }

        // Crear el pedido con la dirección de entrega
        Pedido pedido = Pedido.builder()
                .cliente(cliente)
                .fechaPedido(LocalDateTime.now())
                .estado(Pedido.EstadoPedido.PENDIENTE)
                .observaciones(dto.getObservaciones())
                .direccionEntrega(dto.getDireccionEntrega())
                .ciudadEntrega(dto.getCiudadEntrega())
                .codigoPostalEntrega(dto.getCodigoPostalEntrega())
                .provinciaEntrega(dto.getProvinciaEntrega())
                .paisEntrega(dto.getPaisEntrega() != null ? dto.getPaisEntrega() : "España")
                .detalles(new ArrayList<>())
                .build();

        // Agregar detalles del pedido
        for (DetallePedidoFormDTO detalleDTO : dto.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Producto no encontrado con ID: " + detalleDTO.getProductoId()
                    ));

            if (!producto.getDisponible()) {
                throw new BusinessException(
                        "El producto '" + producto.getNombre() + "' no está disponible"
                );
            }

            if (producto.getStock() < detalleDTO.getCantidad()) {
                throw new BusinessException(
                        "Stock insuficiente para el producto '" + producto.getNombre() +
                                "'. Disponible: " + producto.getStock() + ", solicitado: " + detalleDTO.getCantidad()
                );
            }

            // Reducir el stock
            producto.reducirStock(detalleDTO.getCantidad());

            DetallePedido detalle = DetallePedido.builder()
                    .pedido(pedido)
                    .producto(producto)
                    .cantidad(detalleDTO.getCantidad())
                    .precioUnitario(producto.getPrecio())
                    .build();

            pedido.getDetalles().add(detalle);
        }

        pedido.calcularTotal();

        // ASIGNAR REPARTIDOR AUTOMÁTICAMENTE
        Repartidor repartidorAsignado = asignarRepartidorAutomatico();
        if (repartidorAsignado != null) {
            pedido.setRepartidor(repartidorAsignado);
            pedido.setEstado(Pedido.EstadoPedido.EN_PREPARACION);
            log.info("Repartidor asignado automáticamente: {} al pedido", repartidorAsignado.getNombre());
        } else {
            log.warn("No hay repartidores disponibles. Pedido queda como PENDIENTE");
        }

        Pedido guardado = pedidoRepository.save(pedido);

        return pedidoMapper.toDetalleDTO(guardado);
    }

    private Repartidor asignarRepartidorAutomatico() {
        List<Repartidor> repartidoresActivos = repartidorRepository.findByActivoTrue();

        if (repartidoresActivos.isEmpty()) {
            log.warn("No hay repartidores activos disponibles");
            return null;
        }

        Repartidor mejorRepartidor = null;
        long menorCarga = Long.MAX_VALUE;

        for (Repartidor repartidor : repartidoresActivos) {
            Long pedidosEnCamino = pedidoRepository.contarPedidosEnCaminoDelRepartidor(repartidor.getId());

            // Solo asignar si tiene menos del máximo permitido
            if (pedidosEnCamino < MAX_PEDIDOS_EN_CAMINO && pedidosEnCamino < menorCarga) {
                menorCarga = pedidosEnCamino;
                mejorRepartidor = repartidor;
            }
        }

        if (mejorRepartidor != null) {
            log.info("Repartidor seleccionado: {} con {} entregas activas",
                    mejorRepartidor.getNombre(), menorCarga);
        } else {
            log.warn("Todos los repartidores están al máximo de capacidad");
        }

        return mejorRepartidor;
    }

    @Transactional
    public PedidoDetalleDTO actualizarEstado(Long id, Pedido.EstadoPedido nuevoEstado) {
        log.info("Actualizando estado del pedido ID: {} a {}", id, nuevoEstado);

        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pedido no encontrado con ID: " + id
                ));

        pedido.setEstado(nuevoEstado);
        Pedido actualizado = pedidoRepository.save(pedido);

        return pedidoMapper.toDetalleDTO(actualizado);
    }

    @Transactional
    public PedidoDetalleDTO asignarRepartidor(Long pedidoId, Long repartidorId) {
        log.info("Asignando repartidor {} al pedido {}", repartidorId, pedidoId);

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Pedido no encontrado con ID: " + pedidoId
                ));

        if (pedido.getEstado() != Pedido.EstadoPedido.EN_PREPARACION &&
                pedido.getEstado() != Pedido.EstadoPedido.PENDIENTE) {
            throw new BusinessException(
                    "Solo se pueden asignar repartidores a pedidos pendientes o en preparación. " +
                            "Estado actual: " + pedido.getEstado()
            );
        }

        Repartidor repartidor = repartidorRepository.findById(repartidorId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Repartidor no encontrado con ID: " + repartidorId
                ));

        if (!repartidor.getActivo()) {
            throw new BusinessException(
                    "El repartidor no está activo"
            );
        }

        Long pedidosEnCamino = pedidoRepository.contarPedidosEnCaminoDelRepartidor(repartidorId);
        if (pedidosEnCamino >= MAX_PEDIDOS_EN_CAMINO) {
            throw new BusinessException(
                    String.format("El repartidor ya tiene %d pedidos en camino. " +
                            "No puede aceptar más entregas.", MAX_PEDIDOS_EN_CAMINO)
            );
        }

        pedido.setRepartidor(repartidor);
        pedido.setEstado(Pedido.EstadoPedido.EN_CAMINO);

        Pedido actualizado = pedidoRepository.save(pedido);

        return pedidoMapper.toDetalleDTO(actualizado);
    }

    public Page<PedidoListaDTO> listarPedidosSinRepartidor(Pageable pageable) {
        log.info("Listando pedidos sin repartidor asignado");

        Page<Pedido> pedidos = pedidoRepository.buscarPedidosSinRepartidor(pageable);
        return pedidos.map(pedidoMapper::toListaDTO);
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando pedido ID: {}", id);

        if (!pedidoRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Pedido no encontrado con ID: " + id
            );
        }

        pedidoRepository.deleteById(id);
    }

    public Page<PedidoListaDTO> buscarPorClienteYEstado(
            Long clienteId,
            Pedido.EstadoPedido estado,
            Pageable pageable) {

        log.info("Buscando pedidos del cliente ID: {} con estado: {}", clienteId, estado);

        Page<Pedido> pedidos = pedidoRepository.buscarPorClienteYEstado(clienteId, estado, pageable);
        return pedidos.map(pedidoMapper::toListaDTO);
    }
}