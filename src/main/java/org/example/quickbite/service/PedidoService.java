package org.example.quickbite.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.quickbite.dto.request.PedidoFormDTO;
import org.example.quickbite.dto.response.PedidoDetalleDTO;
import org.example.quickbite.dto.response.PedidoListaDTO;
import org.example.quickbite.exception.BusinessException;
import org.example.quickbite.exception.ResourceNotFoundException;
import org.example.quickbite.mapper.PedidoMapper;
import org.example.quickbite.model.*;
import org.example.quickbite.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    public Page<PedidoListaDTO> listarTodos(Pageable pageable) {
        log.info("Listando todos los pedidos - Página: {}", pageable.getPageNumber());
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("fechaPedido").descending()
        );
        Page<Pedido> pedidos = pedidoRepository.findAll(sortedPageable);
        return pedidos.map(pedidoMapper::toListaDTO);
    }

    public PedidoDetalleDTO buscarPorId(Long id) {
        log.info("Buscando pedido con ID: {}", id);
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con ID: " + id));
        return pedidoMapper.toDetalleDTO(pedido);
    }

    public List<PedidoListaDTO> buscarPorCliente(Long clienteId) {
        log.info("Buscando pedidos del cliente ID: {}", clienteId);
        List<Pedido> pedidos = pedidoRepository.findByClienteIdOrderByFechaPedidoDesc(clienteId);
        return pedidoMapper.toListaDTOList(pedidos);
    }

    public List<PedidoListaDTO> buscarPorRepartidor(Long repartidorId) {
        log.info("Buscando pedidos del repartidor ID: {}", repartidorId);
        List<Pedido> pedidos = pedidoRepository.findByRepartidorIdOrderByFechaPedidoDesc(repartidorId);
        return pedidoMapper.toListaDTOList(pedidos);
    }

    public List<PedidoListaDTO> buscarPorEstado(Pedido.EstadoPedido estado) {
        log.info("Buscando pedidos con estado: {}", estado);
        List<Pedido> pedidos = pedidoRepository.findByEstadoOrderByFechaPedidoDesc(estado);
        return pedidoMapper.toListaDTOList(pedidos);
    }

    @Transactional
    public PedidoDetalleDTO crearPedidoParaUsuario(Usuario usuario, PedidoFormDTO dto) {
        log.info("Creando nuevo pedido para usuario: {}", usuario.getUsername());

        // Buscar el cliente asociado al usuario autenticado
        Cliente cliente = clienteRepository.findByUsuarioUsername(usuario.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado para el usuario: " + usuario.getUsername()));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setFechaPedido(LocalDateTime.now());
        pedido.setEstado(Pedido.EstadoPedido.PENDIENTE);
        pedido.setDireccionEntrega(dto.getDireccionEntrega());
        pedido.setCiudadEntrega(dto.getCiudadEntrega());
        pedido.setCodigoPostalEntrega(dto.getCodigoPostalEntrega());
        pedido.setProvinciaEntrega(dto.getProvinciaEntrega());
        pedido.setPaisEntrega(dto.getPaisEntrega());
        pedido.setObservaciones(dto.getObservaciones());

        List<DetallePedido> detalles = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (var detalleDTO : dto.getDetalles()) {
            Producto producto = productoRepository.findById(detalleDTO.getProductoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + detalleDTO.getProductoId()));

            // VALIDAR QUE EL RESTAURANTE ESTÉ ACTIVO
            if (producto.getRestaurante() == null) {
                throw new BusinessException("El producto '" + producto.getNombre() + "' no tiene un restaurante asignado");
            }

            if (!producto.getRestaurante().getActivo()) {
                throw new BusinessException("El restaurante '" + producto.getRestaurante().getNombre() + "' no está disponible en este momento");
            }

            if (!producto.getDisponible()) {
                throw new BusinessException("El producto '" + producto.getNombre() + "' no está disponible");
            }

            if (producto.getStock() < detalleDTO.getCantidad()) {
                throw new BusinessException("Stock insuficiente para el producto '" + producto.getNombre() + "'");
            }

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setCantidad(detalleDTO.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            detalle.setSubtotal(producto.getPrecio().multiply(BigDecimal.valueOf(detalleDTO.getCantidad())));

            detalles.add(detalle);
            total = total.add(detalle.getSubtotal());

            producto.setStock(producto.getStock() - detalleDTO.getCantidad());
            productoRepository.save(producto);
        }

        pedido.setDetalles(detalles);
        pedido.setTotal(total);

        Pedido guardado = pedidoRepository.save(pedido);
        log.info("Pedido creado con ID: {} por un total de {}€", guardado.getId(), total);
        return pedidoMapper.toDetalleDTO(guardado);
    }

    @Transactional
    public PedidoDetalleDTO asignarRepartidor(Long pedidoId, Long repartidorId) {
        log.info("Asignando repartidor ID: {} al pedido ID: {}", repartidorId, pedidoId);

        Pedido pedido = pedidoRepository.findById(pedidoId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con ID: " + pedidoId));

        Repartidor repartidor = repartidorRepository.findById(repartidorId)
                .orElseThrow(() -> new ResourceNotFoundException("Repartidor no encontrado con ID: " + repartidorId));

        if (!repartidor.getActivo()) {
            throw new BusinessException("El repartidor no está activo");
        }

        long pedidosPendientes = pedidoRepository.countPedidosPendientesByRepartidor(repartidorId);
        if (pedidosPendientes >= 3) {
            throw new BusinessException("El repartidor ya tiene 3 pedidos pendientes. No puede recibir más hasta finalizar alguno.");
        }

        pedido.setRepartidor(repartidor);
        if (pedido.getEstado() == Pedido.EstadoPedido.PENDIENTE) {
            pedido.setEstado(Pedido.EstadoPedido.EN_PREPARACION);
        }

        Pedido actualizado = pedidoRepository.save(pedido);
        log.info("Repartidor asignado correctamente");
        return pedidoMapper.toDetalleDTO(actualizado);
    }

    @Transactional
    public PedidoDetalleDTO cambiarEstado(Long id, Pedido.EstadoPedido nuevoEstado) {
        log.info("Cambiando estado del pedido ID: {} a {}", id, nuevoEstado);
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con ID: " + id));

        // Validar transiciones de estado
        validarTransicionEstado(pedido.getEstado(), nuevoEstado);

        pedido.setEstado(nuevoEstado);
        Pedido actualizado = pedidoRepository.save(pedido);
        return pedidoMapper.toDetalleDTO(actualizado);
    }

    @Transactional
    public PedidoDetalleDTO actualizarEstado(Long id, Pedido.EstadoPedido nuevoEstado) {
        return cambiarEstado(id, nuevoEstado);
    }

    public Page<PedidoListaDTO> listarPedidosDelUsuario(Usuario usuario, Pageable pageable) {
        log.info("Listando pedidos del usuario: {}", usuario.getUsername());
        Cliente cliente = clienteRepository.findByUsuarioUsername(usuario.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente no encontrado para el usuario: " + usuario.getUsername()));
        List<Pedido> pedidos = pedidoRepository.findByClienteIdOrderByFechaPedidoDesc(cliente.getId());
        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize()
        ).toOptional().map(p -> pedidoMapper.toListaDTOList(pedidos)).map(list ->
                new org.springframework.data.domain.PageImpl<>(list, pageable, list.size())
        ).orElseThrow();
    }

    public Page<PedidoListaDTO> listarPedidosSinRepartidor(Pageable pageable) {
        log.info("Listando pedidos sin repartidor");
        List<Pedido> pedidos = pedidoRepository.findByEstadoOrderByFechaPedidoDesc(Pedido.EstadoPedido.PENDIENTE)
                .stream()
                .filter(p -> p.getRepartidor() == null)
                .toList();
        return new org.springframework.data.domain.PageImpl<>(
                pedidoMapper.toListaDTOList(pedidos), pageable, pedidos.size()
        );
    }

    public Page<PedidoListaDTO> buscarPorClienteYEstado(Long clienteId, Pedido.EstadoPedido estado, Pageable pageable) {
        log.info("Buscando pedidos del cliente ID: {} con estado: {}", clienteId, estado);
        List<Pedido> pedidos;
        if (estado != null) {
            pedidos = pedidoRepository.findByClienteIdOrderByFechaPedidoDesc(clienteId)
                    .stream()
                    .filter(p -> p.getEstado() == estado)
                    .toList();
        } else {
            pedidos = pedidoRepository.findByClienteIdOrderByFechaPedidoDesc(clienteId);
        }
        return new org.springframework.data.domain.PageImpl<>(
                pedidoMapper.toListaDTOList(pedidos), pageable, pedidos.size()
        );
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando pedido ID: {}", id);
        cancelar(id);
        pedidoRepository.deleteById(id);
    }

    @Transactional
    public void cancelar(Long id) {
        log.info("Cancelando pedido ID: {}", id);
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido no encontrado con ID: " + id));

        if (pedido.getEstado() == Pedido.EstadoPedido.ENTREGADO || pedido.getEstado() == Pedido.EstadoPedido.CANCELADO) {
            throw new BusinessException("No se puede cancelar un pedido que ya está entregado o cancelado");
        }

        // Devolver stock
        for (DetallePedido detalle : pedido.getDetalles()) {
            Producto producto = detalle.getProducto();
            producto.setStock(producto.getStock() + detalle.getCantidad());
            productoRepository.save(producto);
        }

        pedido.setEstado(Pedido.EstadoPedido.CANCELADO);
        pedidoRepository.save(pedido);
    }

    private void validarTransicionEstado(Pedido.EstadoPedido estadoActual, Pedido.EstadoPedido nuevoEstado) {

        if (estadoActual == Pedido.EstadoPedido.ENTREGADO || estadoActual == Pedido.EstadoPedido.CANCELADO) {
            throw new BusinessException("No se puede cambiar el estado de un pedido " + estadoActual);
        }

        switch (estadoActual) {
            case PENDIENTE:
                if (nuevoEstado != Pedido.EstadoPedido.EN_PREPARACION && nuevoEstado != Pedido.EstadoPedido.CANCELADO) {
                    throw new BusinessException("Un pedido PENDIENTE solo puede pasar a EN_PREPARACION o CANCELADO");
                }
                break;
            case EN_PREPARACION:
                if (nuevoEstado != Pedido.EstadoPedido.EN_CAMINO && nuevoEstado != Pedido.EstadoPedido.CANCELADO) {
                    throw new BusinessException("Un pedido EN_PREPARACION solo puede pasar a EN_CAMINO o CANCELADO");
                }
                break;
            case EN_CAMINO:
                if (nuevoEstado != Pedido.EstadoPedido.ENTREGADO && nuevoEstado != Pedido.EstadoPedido.CANCELADO) {
                    throw new BusinessException("Un pedido EN_CAMINO solo puede pasar a ENTREGADO o CANCELADO");
                }
                break;
        }
    }
}