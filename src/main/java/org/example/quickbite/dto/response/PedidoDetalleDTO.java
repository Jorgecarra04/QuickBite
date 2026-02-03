package org.example.quickbite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoDetalleDTO {
    private Long id;
    private Long clienteId;
    private String clienteNombre;

    private Long repartidorId;
    private String repartidorNombre;
    private String repartidorEmail;

    private String fechaPedido;
    private String estado;
    private BigDecimal total;
    private String observaciones;

    private String direccionEntrega;
    private String ciudadEntrega;
    private String codigoPostalEntrega;
    private String provinciaEntrega;
    private String paisEntrega;

    private List<DetallePedidoDTO> detalles;
}