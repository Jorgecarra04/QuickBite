package org.example.quickbite.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.quickbite.dto.request.ClienteFormDTO;
import org.example.quickbite.dto.response.ClienteDetalleDTO;
import org.example.quickbite.dto.response.ClienteListaDTO;
import org.example.quickbite.exception.ResourceNotFoundException;
import org.example.quickbite.mapper.ClienteMapper;
import org.example.quickbite.model.Cliente;
import org.example.quickbite.model.Usuario;
import org.example.quickbite.repository.ClienteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class ClienteService {

    private final ClienteRepository clienteRepository;
    private final ClienteMapper clienteMapper;

    public Page<ClienteListaDTO> listarTodos(Pageable pageable) {
        log.info("Listando todos los clientes - Página: {}, Tamaño: {}",
                pageable.getPageNumber(), pageable.getPageSize());

        Page<Cliente> clientes = clienteRepository.findAll(pageable);
        return clientes.map(clienteMapper::toListaDTO);
    }

    public ClienteDetalleDTO buscarPorId(Long id) {
        log.info("Buscando cliente con ID: {}", id);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cliente no encontrado con ID: " + id
                ));

        return clienteMapper.toDetalleDTO(cliente);
    }

    public ClienteDetalleDTO buscarPorUsuario(Usuario usuario) {
        log.info("Buscando cliente para usuario: {}", usuario.getUsername());

        Cliente cliente = clienteRepository.findByUsuario(usuario)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No se encontró un perfil de cliente para el usuario: " + usuario.getUsername()
                ));

        return clienteMapper.toDetalleDTO(cliente);
    }

    @Transactional
    public ClienteDetalleDTO crear(ClienteFormDTO dto) {
        log.info("Creando nuevo cliente");

        Cliente cliente = clienteMapper.toEntity(dto);
        Cliente guardado = clienteRepository.save(cliente);

        return clienteMapper.toDetalleDTO(guardado);
    }

    @Transactional
    public ClienteDetalleDTO actualizar(Long id, ClienteFormDTO dto) {
        log.info("Actualizando cliente ID: {}", id);

        Cliente cliente = clienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Cliente no encontrado con ID: " + id
                ));

        clienteMapper.updateEntityFromDTO(dto, cliente);
        Cliente actualizado = clienteRepository.save(cliente);

        return clienteMapper.toDetalleDTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando cliente ID: {}", id);

        if (!clienteRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Cliente no encontrado con ID: " + id
            );
        }

        clienteRepository.deleteById(id);
    }

    public Page<ClienteListaDTO> buscarPorTexto(String texto, Pageable pageable) {
        log.info("Buscando clientes con texto: {}", texto);

        Page<Cliente> clientes = clienteRepository.buscarPorNombreOApellidos(texto, pageable);
        return clientes.map(clienteMapper::toListaDTO);
    }
}