package org.example.quickbite.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.quickbite.dto.request.RestauranteFormDTO;
import org.example.quickbite.dto.response.RestauranteDetalleDTO;
import org.example.quickbite.dto.response.RestauranteListaDTO;
import org.example.quickbite.exception.BusinessException;
import org.example.quickbite.exception.ResourceNotFoundException;
import org.example.quickbite.mapper.RestauranteMapper;
import org.example.quickbite.model.Restaurante;
import org.example.quickbite.repository.RestauranteRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RestauranteService {

    private final RestauranteRepository restauranteRepository;
    private final RestauranteMapper restauranteMapper;

    public Page<RestauranteListaDTO> listarTodos(Pageable pageable) {
        log.info("Listando todos los restaurantes - Página: {}", pageable.getPageNumber());
        Page<Restaurante> restaurantes = restauranteRepository.findAll(pageable);
        return restaurantes.map(restauranteMapper::toListaDTO);
    }

    public List<RestauranteListaDTO> listarActivos() {
        log.info("Listando restaurantes activos");
        List<Restaurante> restaurantes = restauranteRepository.findByActivoTrue();
        return restaurantes.stream()
                .map(restauranteMapper::toListaDTO)
                .toList();
    }

    public RestauranteDetalleDTO buscarPorId(Long id) {
        log.info("Buscando restaurante con ID: {}", id);
        Restaurante restaurante = restauranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado con ID: " + id));
        return restauranteMapper.toDetalleDTO(restaurante);
    }

    @Transactional
    public RestauranteDetalleDTO crear(RestauranteFormDTO dto) {
        log.info("Creando nuevo restaurante: {}", dto.getNombre());

        // Validar que no exista otro restaurante con el mismo nombre
        if (restauranteRepository.findByNombre(dto.getNombre()).isPresent()) {
            throw new BusinessException("Ya existe un restaurante con el nombre: " + dto.getNombre());
        }

        // Validar que no exista otro restaurante con el mismo teléfono
        if (restauranteRepository.findByTelefono(dto.getTelefono()).isPresent()) {
            throw new BusinessException("Ya existe un restaurante con el teléfono: " + dto.getTelefono());
        }

        Restaurante restaurante = restauranteMapper.toEntity(dto);
        Restaurante guardado = restauranteRepository.save(restaurante);
        return restauranteMapper.toDetalleDTO(guardado);
    }

    @Transactional
    public RestauranteDetalleDTO actualizar(Long id, RestauranteFormDTO dto) {
        log.info("Actualizando restaurante ID: {}", id);
        Restaurante restaurante = restauranteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado con ID: " + id));

        // Validar que no exista otro restaurante con el mismo nombre (excluyendo el actual)
        restauranteRepository.findByNombre(dto.getNombre()).ifPresent(r -> {
            if (!r.getId().equals(id)) {
                throw new BusinessException("Ya existe un restaurante con el nombre: " + dto.getNombre());
            }
        });

        // Validar que no exista otro restaurante con el mismo teléfono (excluyendo el actual)
        restauranteRepository.findByTelefono(dto.getTelefono()).ifPresent(r -> {
            if (!r.getId().equals(id)) {
                throw new BusinessException("Ya existe un restaurante con el teléfono: " + dto.getTelefono());
            }
        });

        restauranteMapper.updateEntityFromDTO(dto, restaurante);
        Restaurante actualizado = restauranteRepository.save(restaurante);
        return restauranteMapper.toDetalleDTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando restaurante ID: {}", id);
        if (!restauranteRepository.existsById(id)) {
            throw new ResourceNotFoundException("Restaurante no encontrado con ID: " + id);
        }
        restauranteRepository.deleteById(id);
    }
}