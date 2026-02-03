package org.example.quickbite.mapper;

import org.example.quickbite.dto.request.RepartidorFormDTO;
import org.example.quickbite.dto.response.RepartidorDetalleDTO;
import org.example.quickbite.dto.response.RepartidorListaDTO;
import org.example.quickbite.model.Repartidor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.List;

@Mapper(componentModel = "spring")
public interface RepartidorMapper {

    RepartidorListaDTO toListaDTO(Repartidor repartidor);

    List<RepartidorListaDTO> toListaDTOList(List<Repartidor> repartidores);

    RepartidorDetalleDTO toDetalleDTO(Repartidor repartidor);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pedidos", ignore = true)
    Repartidor toEntity(RepartidorFormDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pedidos", ignore = true)
    void updateEntityFromDTO(RepartidorFormDTO dto, @MappingTarget Repartidor entity);
}