package org.example.quickbite.controller;

import org.example.quickbite.dto.request.PedidoFormDTO;
import org.example.quickbite.dto.response.PedidoDetalleDTO;
import org.example.quickbite.dto.response.PedidoListaDTO;
import org.example.quickbite.model.Pedido;
import org.example.quickbite.model.Usuario;
import org.example.quickbite.service.PedidoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {
    private final PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<Page<PedidoListaDTO>> listarTodos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaPedido"));
        Page<PedidoListaDTO> pedidos = pedidoService.listarTodos(pageable);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/mis-pedidos")
    public ResponseEntity<Page<PedidoListaDTO>> misPedidos(
            @AuthenticationPrincipal Usuario usuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaPedido"));
        Page<PedidoListaDTO> pedidos = pedidoService.listarPedidosDelUsuario(usuario, pageable);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/sin-repartidor")
    public ResponseEntity<Page<PedidoListaDTO>> listarSinRepartidor(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("fechaPedido"));
        Page<PedidoListaDTO> pedidos = pedidoService.listarPedidosSinRepartidor(pageable);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PedidoDetalleDTO> obtenerPorId(@PathVariable Long id) {
        PedidoDetalleDTO pedidoDTO = pedidoService.buscarPorId(id);
        return ResponseEntity.ok(pedidoDTO);
    }

    @PostMapping
    public ResponseEntity<PedidoDetalleDTO> crear(
            @AuthenticationPrincipal Usuario usuario,
            @RequestBody @Valid PedidoFormDTO dto) {
        PedidoDetalleDTO creado = pedidoService.crearPedidoParaUsuario(usuario, dto);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(creado);
    }

    @PatchMapping("/{id}/estado")
    public ResponseEntity<PedidoDetalleDTO> actualizarEstado(
            @PathVariable Long id,
            @RequestParam Pedido.EstadoPedido estado) {
        PedidoDetalleDTO actualizado = pedidoService.actualizarEstado(id, estado);
        return ResponseEntity.ok(actualizado);
    }

    @PatchMapping("/{id}/asignar-repartidor")
    public ResponseEntity<PedidoDetalleDTO> asignarRepartidor(
            @PathVariable Long id,
            @RequestParam Long repartidorId) {
        PedidoDetalleDTO actualizado = pedidoService.asignarRepartidor(id, repartidorId);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        pedidoService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<Page<PedidoListaDTO>> buscarPorCliente(
            @PathVariable Long clienteId,
            @RequestParam(required = false) Pedido.EstadoPedido estado,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "fechaPedido"));
        Page<PedidoListaDTO> pedidos = pedidoService.buscarPorClienteYEstado(clienteId, estado, pageable);
        return ResponseEntity.ok(pedidos);
    }
}