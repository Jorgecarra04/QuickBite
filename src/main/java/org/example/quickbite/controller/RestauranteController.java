package org.example.quickbite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.quickbite.dto.request.RestauranteFormDTO;
import org.example.quickbite.dto.response.RestauranteDetalleDTO;
import org.example.quickbite.dto.response.RestauranteListaDTO;
import org.example.quickbite.service.RestauranteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/restaurantes")
@RequiredArgsConstructor
public class RestauranteController {

    private final RestauranteService restauranteService;

    @GetMapping
    public ResponseEntity<Page<RestauranteListaDTO>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<RestauranteListaDTO> restaurantes = restauranteService.listarTodos(pageable);
        return ResponseEntity.ok(restaurantes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RestauranteDetalleDTO> obtenerPorId(@PathVariable Long id) {
        RestauranteDetalleDTO restaurante = restauranteService.buscarPorId(id);
        return ResponseEntity.ok(restaurante);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RestauranteDetalleDTO> crear(@Valid @RequestBody RestauranteFormDTO dto) {
        RestauranteDetalleDTO creado = restauranteService.crear(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(creado);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<RestauranteDetalleDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody RestauranteFormDTO dto) {
        RestauranteDetalleDTO actualizado = restauranteService.actualizar(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        restauranteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}