package org.example.quickbite.mapper;

import org.example.quickbite.dto.response.DetallePedidoDTO;
import org.example.quickbite.dto.response.PedidoDetalleDTO;
import org.example.quickbite.dto.response.PedidoListaDTO;
import org.example.quickbite.model.DetallePedido;
import org.example.quickbite.model.Pedido;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import java.util.List;

@Mapper(componentModel = "spring")
public interface PedidoMapper {

    @Mapping(target = "clienteNombre",
            expression = "java(pedido.getCliente().getNombre() + \" \" + pedido.getCliente().getApellidos())")
    @Mapping(source = "fechaPedido", target = "fechaPedido", dateFormat = "dd/MM/yyyy HH:mm")
    @Mapping(source = "estado", target = "estado")
    PedidoListaDTO toListaDTO(Pedido pedido);

    List<PedidoListaDTO> toListaDTOList(List<Pedido> pedidos);

    @Mapping(source = "cliente.id", target = "clienteId")
    @Mapping(target = "clienteNombre",
            expression = "java(pedido.getCliente().getNombre() + \" \" + pedido.getCliente().getApellidos())")
    @Mapping(source = "repartidor.id", target = "repartidorId")
    @Mapping(target = "repartidorNombre",
            expression = "java(pedido.getRepartidor() != null ? pedido.getRepartidor().getNombre() + \" \" + pedido.getRepartidor().getApellidos() : null)")
    @Mapping(target = "repartidorEmail",
            expression = "java(pedido.getRepartidor() != null ? pedido.getRepartidor().getEmail() : null)")
    @Mapping(source = "fechaPedido", target = "fechaPedido", dateFormat = "dd/MM/yyyy HH:mm")
    @Mapping(source = "estado", target = "estado")
    @Mapping(source = "direccionEntrega", target = "direccionEntrega")
    @Mapping(source = "ciudadEntrega", target = "ciudadEntrega")
    @Mapping(source = "codigoPostalEntrega", target = "codigoPostalEntrega")
    @Mapping(source = "provinciaEntrega", target = "provinciaEntrega")
    @Mapping(source = "paisEntrega", target = "paisEntrega")
    @Mapping(source = "detalles", target = "detalles")
    PedidoDetalleDTO toDetalleDTO(Pedido pedido);

    // Mapper para DetallePedido -> DetallePedidoDTO
    @Mapping(source = "producto.id", target = "productoId")
    @Mapping(source = "producto.nombre", target = "productoNombre")
    @Mapping(source = "cantidad", target = "cantidad")
    @Mapping(source = "precioUnitario", target = "precioUnitario")
    @Mapping(source = "subtotal", target = "subtotal")
    DetallePedidoDTO toDetallePedidoDTO(DetallePedido detallePedido);

    List<DetallePedidoDTO> toDetallePedidoDTOList(List<DetallePedido> detalles);
}