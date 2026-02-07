package org.example.quickbite.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.quickbite.dto.request.CategoriaFormDTO;
import org.example.quickbite.dto.response.CategoriaDTO;
import org.example.quickbite.exception.ResourceNotFoundException;
import org.example.quickbite.model.Categoria;
import org.example.quickbite.repository.CategoriaRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    private final CategoriaRepository categoriaRepository;

    @GetMapping
    public ResponseEntity<List<CategoriaDTO>> listarTodas() {
        log.info("Listando todas las categorías");
        List<Categoria> categorias = categoriaRepository.findAllWithProductos();

        List<CategoriaDTO> categoriasDTO = categorias.stream()
                .map(cat -> CategoriaDTO.builder()
                        .id(cat.getId())
                        .nombre(cat.getNombre())
                        .descripcion(cat.getDescripcion())
                        .productosCount((long) cat.getProductos().size())
                        .build())
                .collect(Collectors.toList());

        log.info("Se encontraron {} categorías", categoriasDTO.size());
        return ResponseEntity.ok(categoriasDTO);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> buscarPorId(@PathVariable Long id) {
        log.info("Buscando categoría con ID: {}", id);
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
        return ResponseEntity.ok(categoria);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Categoria> crear(@Validated @RequestBody CategoriaFormDTO dto) {
        log.info("Creando nueva categoría: {}", dto.getNombre());
        Categoria categoria = Categoria.builder()
                .nombre(dto.getNombre())
                .descripcion(dto.getDescripcion())
                .build();
        Categoria saved = categoriaRepository.save(categoria);
        log.info("Categoría creada con ID: {}", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Categoria> actualizar(
            @PathVariable Long id,
            @Validated @RequestBody CategoriaFormDTO dto) {
        log.info("Actualizando categoría con ID: {}", id);
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
        categoria.setNombre(dto.getNombre());
        categoria.setDescripcion(dto.getDescripcion());
        Categoria updated = categoriaRepository.save(categoria);
        log.info("Categoría actualizada: {}", id);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        log.info("Eliminando categoría con ID: {}", id);
        if (!categoriaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Categoría no encontrada con ID: " + id);
        }
        categoriaRepository.deleteById(id);
        log.info("Categoría eliminada: {}", id);
        return ResponseEntity.noContent().build();
    }
}