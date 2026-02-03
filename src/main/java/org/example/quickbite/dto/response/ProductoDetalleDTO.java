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
public class ProductoDetalleDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private BigDecimal precio;
    private Boolean disponible;
    private Integer stock;
    private Long restauranteId;
    private String restauranteNombre;
    private Long categoriaId;
    private String categoriaNombre;
}