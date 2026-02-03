package org.example.quickbite.mapper;

import org.example.quickbite.dto.request.ClienteFormDTO;
import org.example.quickbite.dto.response.ClienteDetalleDTO;
import org.example.quickbite.dto.response.ClienteListaDTO;
import org.example.quickbite.model.Cliente;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.List;


@Mapper(componentModel = "spring")
public interface ClienteMapper {

    ClienteListaDTO toListaDTO(Cliente cliente);

    List<ClienteListaDTO> toListaDTOList(List<Cliente> clientes);

    ClienteDetalleDTO toDetalleDTO(Cliente cliente);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pedidos", ignore = true)
    Cliente toEntity(ClienteFormDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "pedidos", ignore = true)
    void updateEntityFromDTO(ClienteFormDTO dto, @MappingTarget Cliente entity);
}
