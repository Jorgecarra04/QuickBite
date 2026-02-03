package org.example.quickbite.controller;

import org.example.quickbite.dto.request.RepartidorFormDTO;
import org.example.quickbite.dto.response.RepartidorDetalleDTO;
import org.example.quickbite.dto.response.RepartidorListaDTO;
import org.example.quickbite.service.RepartidorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/repartidores")
@RequiredArgsConstructor
public class RepartidorController {
    private final RepartidorService repartidorService;

    @GetMapping
    public ResponseEntity<Page<RepartidorListaDTO>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<RepartidorListaDTO> repartidores = repartidorService.listarTodos(pageable);
        return ResponseEntity.ok(repartidores);
    }

    @GetMapping("/activos")
    public ResponseEntity<Page<RepartidorListaDTO>> listarActivos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("nombre"));
        Page<RepartidorListaDTO> repartidores = repartidorService.listarActivos(pageable);
        return ResponseEntity.ok(repartidores);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RepartidorDetalleDTO> obtenerPorId(@PathVariable Long id) {
        RepartidorDetalleDTO repartidorDTO = repartidorService.buscarPorId(id);
        return ResponseEntity.ok(repartidorDTO);
    }

    @PostMapping
    public ResponseEntity<RepartidorDetalleDTO> crear(@RequestBody @Valid RepartidorFormDTO dto) {
        RepartidorDetalleDTO creado = repartidorService.crear(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RepartidorDetalleDTO> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid RepartidorFormDTO dto) {
        RepartidorDetalleDTO actualizado = repartidorService.actualizar(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<RepartidorDetalleDTO> cambiarEstado(
            @PathVariable Long id,
            @RequestParam Boolean activo) {
        RepartidorDetalleDTO actualizado = repartidorService.cambiarEstado(id, activo);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        repartidorService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}