package org.example.quickbite.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.quickbite.dto.request.ProductoFormDTO;
import org.example.quickbite.dto.response.ProductoDetalleDTO;
import org.example.quickbite.dto.response.ProductoListaDTO;
import org.example.quickbite.exception.BusinessException;
import org.example.quickbite.exception.ResourceNotFoundException;
import org.example.quickbite.mapper.ProductoMapper;
import org.example.quickbite.model.Categoria;
import org.example.quickbite.model.Producto;
import org.example.quickbite.model.Restaurante;
import org.example.quickbite.repository.CategoriaRepository;
import org.example.quickbite.repository.ProductoRepository;
import org.example.quickbite.repository.RestauranteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ProductoService {

    private final ProductoRepository productoRepository;
    private final RestauranteRepository restauranteRepository;
    private final CategoriaRepository categoriaRepository;
    private final ProductoMapper productoMapper;

    public Page<ProductoListaDTO> listarTodos(Pageable pageable) {
        log.info("Listando todos los productos - Página: {}", pageable.getPageNumber());
        Page<Producto> productos = productoRepository.findAll(pageable);
        return productos.map(productoMapper::toListaDTO);
    }

    public Page<ProductoListaDTO> buscarConFiltros(Long restauranteId, Long categoriaId, Boolean disponible, Pageable pageable) {
        log.info("Buscando productos con filtros - Restaurante: {}, Categoría: {}, Disponible: {}",
                restauranteId, categoriaId, disponible);

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("nombre").ascending()
        );

        Page<Producto> productos = productoRepository.findByFilters(
                restauranteId, categoriaId, disponible, sortedPageable
        );

        return productos.map(productoMapper::toListaDTO);
    }

    public ProductoDetalleDTO buscarPorId(Long id) {
        log.info("Buscando producto con ID: {}", id);
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        return productoMapper.toDetalleDTO(producto);
    }

    @Transactional
    public ProductoDetalleDTO crear(ProductoFormDTO dto) {
        log.info("Creando nuevo producto: {}", dto.getNombre());

        // Validar que no exista otro producto con el mismo nombre
        if (productoRepository.findByNombre(dto.getNombre()).isPresent()) {
            throw new BusinessException("Ya existe un producto con el nombre: " + dto.getNombre());
        }

        Restaurante restaurante = restauranteRepository.findById(dto.getRestauranteId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado con ID: " + dto.getRestauranteId()));

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + dto.getCategoriaId()));

        Producto producto = productoMapper.toEntity(dto);
        producto.setRestaurante(restaurante);
        producto.setCategoria(categoria);

        Producto guardado = productoRepository.save(producto);
        return productoMapper.toDetalleDTO(guardado);
    }

    @Transactional
    public ProductoDetalleDTO actualizar(Long id, ProductoFormDTO dto) {
        log.info("Actualizando producto ID: {}", id);
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));

        // Validar que no exista otro producto con el mismo nombre (excluyendo el actual)
        productoRepository.findByNombre(dto.getNombre()).ifPresent(p -> {
            if (!p.getId().equals(id)) {
                throw new BusinessException("Ya existe un producto con el nombre: " + dto.getNombre());
            }
        });

        Restaurante restaurante = restauranteRepository.findById(dto.getRestauranteId())
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado con ID: " + dto.getRestauranteId()));

        Categoria categoria = categoriaRepository.findById(dto.getCategoriaId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + dto.getCategoriaId()));

        productoMapper.updateEntityFromDTO(dto, producto);
        producto.setRestaurante(restaurante);
        producto.setCategoria(categoria);

        Producto actualizado = productoRepository.save(producto);
        return productoMapper.toDetalleDTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando producto ID: {}", id);
        if (!productoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto no encontrado con ID: " + id);
        }
        productoRepository.deleteById(id);
    }

    @Transactional
    public ProductoDetalleDTO actualizarStock(Long id, Integer nuevoStock) {
        log.info("Actualizando stock del producto ID: {} a {}", id, nuevoStock);
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
        producto.setStock(nuevoStock);
        Producto actualizado = productoRepository.save(producto);
        return productoMapper.toDetalleDTO(actualizado);
    }

    public List<ProductoListaDTO> buscarPorRestaurante(Long restauranteId) {
        log.info("Buscando productos del restaurante ID: {}", restauranteId);
        List<Producto> productos = productoRepository.findByRestauranteId(restauranteId);
        return productoMapper.toListaDTOList(productos);
    }

    public List<ProductoListaDTO> buscarPorCategoria(Long categoriaId) {
        log.info("Buscando productos de la categoría ID: {}", categoriaId);
        List<Producto> productos = productoRepository.findByCategoriaId(categoriaId);
        return productoMapper.toListaDTOList(productos);
    }
}