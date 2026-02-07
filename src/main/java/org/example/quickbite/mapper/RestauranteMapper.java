package org.example.quickbite.mapper;

import org.example.quickbite.dto.request.RestauranteFormDTO;
import org.example.quickbite.dto.response.RestauranteDetalleDTO;
import org.example.quickbite.dto.response.RestauranteListaDTO;
import org.example.quickbite.model.Restaurante;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface RestauranteMapper {

    @Mapping(target = "activo", source = "activo", qualifiedByName = "mapActivo")
    RestauranteListaDTO toListaDTO(Restaurante restaurante);

    @Mapping(target = "activo", source = "activo", qualifiedByName = "mapActivo")
    RestauranteDetalleDTO toDetalleDTO(Restaurante restaurante);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "productos", ignore = true)
    Restaurante toEntity(RestauranteFormDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "productos", ignore = true)
    void updateEntityFromDTO(RestauranteFormDTO dto, @MappingTarget Restaurante entity);

    @Named("mapActivo")
    default Boolean mapActivo(Boolean activo) {
        return activo != null ? activo : true;
    }
}