package org.example.quickbite.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class RestauranteListaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private String direccion;
    private String telefono;
    private String imagenUrl;
    private Boolean activo;
}