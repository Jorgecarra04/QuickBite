package org.example.quickbite.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.quickbite.dto.request.ClienteFormDTO;
import org.example.quickbite.dto.response.ClienteDetalleDTO;
import org.example.quickbite.dto.response.ClienteListaDTO;
import org.example.quickbite.model.Usuario;
import org.example.quickbite.service.ClienteService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/clientes")
@RequiredArgsConstructor
public class ClienteController {

    private final ClienteService clienteService;

    @GetMapping
    public ResponseEntity<Page<ClienteListaDTO>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));
        Page<ClienteListaDTO> clientes = clienteService.listarTodos(pageable);
        return ResponseEntity.ok(clientes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClienteDetalleDTO> obtenerPorId(@PathVariable Long id) {
        ClienteDetalleDTO clienteDTO = clienteService.buscarPorId(id);
        return ResponseEntity.ok(clienteDTO);
    }

    //Obtiene el perfil del cliente del usuario
    @GetMapping("/mi-perfil")
    public ResponseEntity<ClienteDetalleDTO> obtenerMiPerfil(@AuthenticationPrincipal Usuario usuario) {
        ClienteDetalleDTO clienteDTO = clienteService.buscarPorUsuario(usuario);
        return ResponseEntity.ok(clienteDTO);
    }

    @PostMapping
    public ResponseEntity<ClienteDetalleDTO> crear(@RequestBody @Valid ClienteFormDTO dto) {
        ClienteDetalleDTO creado = clienteService.crear(dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(creado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ClienteDetalleDTO> actualizar(
            @PathVariable Long id,
            @RequestBody @Valid ClienteFormDTO dto) {
        ClienteDetalleDTO actualizado = clienteService.actualizar(id, dto);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        clienteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/buscar")
    public ResponseEntity<Page<ClienteListaDTO>> buscarPorTexto(
            @RequestParam String texto,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<ClienteListaDTO> clientes = clienteService.buscarPorTexto(texto, pageable);
        return ResponseEntity.ok(clientes);
    }
}