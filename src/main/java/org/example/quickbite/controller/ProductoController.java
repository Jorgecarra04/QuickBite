package org.example.quickbite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.quickbite.dto.request.ProductoFormDTO;
import org.example.quickbite.dto.response.ProductoDetalleDTO;
import org.example.quickbite.dto.response.ProductoListaDTO;
import org.example.quickbite.service.ProductoService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;

    @GetMapping
    public ResponseEntity<Page<ProductoListaDTO>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductoListaDTO> productos = productoService.listarTodos(pageable);
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoDetalleDTO> obtenerPorId(@PathVariable Long id) {
        ProductoDetalleDTO productoDTO = productoService.buscarPorId(id);
        return ResponseEntity.ok(productoDTO);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDetalleDTO> crear(@RequestBody @Valid ProductoFormDTO dto) {
        ProductoDetalleDTO creado = productoService.crear(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(creado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDetalleDTO> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid ProductoFormDTO dto) {
        ProductoDetalleDTO actualizado = productoService.actualizar(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        productoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filtrar")
    public ResponseEntity<Page<ProductoListaDTO>> buscarConFiltros(
            @RequestParam(required = false) Long restauranteId,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) Boolean disponible,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "nombre") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ProductoListaDTO> productos = productoService.buscarConFiltros(
                restauranteId, categoriaId, disponible, pageable);
        return ResponseEntity.ok(productos);
    }

    @PatchMapping("/{id}/stock")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductoDetalleDTO> actualizarStock(
            @PathVariable Long id,
            @RequestParam Integer stock) {
        ProductoDetalleDTO actualizado = productoService.actualizarStock(id, stock);
        return ResponseEntity.ok(actualizado);
    }
}