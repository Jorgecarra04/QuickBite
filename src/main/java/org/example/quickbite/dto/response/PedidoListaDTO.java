package org.example.quickbite.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PedidoListaDTO {
    private Long id;
    private String clienteNombre;
    private String fechaPedido;
    private String estado;
    private BigDecimal total;
}
