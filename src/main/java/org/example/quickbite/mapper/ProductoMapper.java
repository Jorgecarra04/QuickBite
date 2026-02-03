package org.example.quickbite.mapper;

import org.example.quickbite.dto.request.ProductoFormDTO;
import org.example.quickbite.dto.response.ProductoDetalleDTO;
import org.example.quickbite.dto.response.ProductoListaDTO;
import org.example.quickbite.model.Producto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import java.util.List;


@Mapper(componentModel = "spring")
public interface ProductoMapper {

    @Mapping(source = "restaurante.nombre", target = "restauranteNombre")
    @Mapping(source = "categoria.nombre", target = "categoriaNombre")
    ProductoListaDTO toListaDTO(Producto producto);

    List<ProductoListaDTO> toListaDTOList(List<Producto> productos);

    @Mapping(source = "restaurante.id", target = "restauranteId")
    @Mapping(source = "restaurante.nombre", target = "restauranteNombre")
    @Mapping(source = "categoria.id", target = "categoriaId")
    @Mapping(source = "categoria.nombre", target = "categoriaNombre")
    ProductoDetalleDTO toDetalleDTO(Producto producto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurante", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "detallesPedido", ignore = true)
    Producto toEntity(ProductoFormDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "restaurante", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "detallesPedido", ignore = true)
    void updateEntityFromDTO(ProductoFormDTO dto, @MappingTarget Producto entity);
}
