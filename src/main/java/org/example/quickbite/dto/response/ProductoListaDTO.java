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
public class ProductoListaDTO {
    private Long id;
    private String nombre;
    private BigDecimal precio;
    private Boolean disponible;
    private Integer stock;
    private String restauranteNombre;
    private String categoriaNombre;
}