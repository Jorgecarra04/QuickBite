package org.example.quickbite.service;

import org.example.quickbite.dto.request.RepartidorFormDTO;
import org.example.quickbite.dto.response.RepartidorDetalleDTO;
import org.example.quickbite.dto.response.RepartidorListaDTO;
import org.example.quickbite.exception.BusinessException;
import org.example.quickbite.exception.ResourceNotFoundException;
import org.example.quickbite.mapper.RepartidorMapper;
import org.example.quickbite.model.Repartidor;
import org.example.quickbite.repository.RepartidorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class RepartidorService {

    private final RepartidorRepository repartidorRepository;
    private final RepartidorMapper repartidorMapper;

    public Page<RepartidorListaDTO> listarTodos(Pageable pageable) {
        log.info("Listando todos los repartidores - Página: {}", pageable.getPageNumber());

        Page<Repartidor> repartidores = repartidorRepository.findAll(pageable);
        return repartidores.map(repartidorMapper::toListaDTO);
    }

    public Page<RepartidorListaDTO> listarActivos(Pageable pageable) {
        log.info("Listando repartidores activos");

        Page<Repartidor> repartidores = repartidorRepository.findByActivo(true, pageable);
        return repartidores.map(repartidorMapper::toListaDTO);
    }

    public RepartidorDetalleDTO buscarPorId(Long id) {
        log.info("Buscando repartidor con ID: {}", id);

        Repartidor repartidor = repartidorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Repartidor no encontrado con ID: " + id
                ));

        return repartidorMapper.toDetalleDTO(repartidor);
    }

    @Transactional
    public RepartidorDetalleDTO crear(RepartidorFormDTO dto) {
        log.info("Creando nuevo repartidor: {}", dto.getEmail());

        if (repartidorRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException(
                    "Ya existe un repartidor registrado con el email: " + dto.getEmail()
            );
        }

        Repartidor repartidor = repartidorMapper.toEntity(dto);
        Repartidor guardado = repartidorRepository.save(repartidor);

        return repartidorMapper.toDetalleDTO(guardado);
    }

    @Transactional
    public RepartidorDetalleDTO actualizar(Long id, RepartidorFormDTO dto) {
        log.info("Actualizando repartidor ID: {}", id);

        Repartidor repartidor = repartidorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Repartidor no encontrado con ID: " + id
                ));

        if (!repartidor.getEmail().equals(dto.getEmail())
                && repartidorRepository.existsByEmail(dto.getEmail())) {
            throw new BusinessException(
                    "Ya existe otro repartidor con el email: " + dto.getEmail()
            );
        }

        repartidorMapper.updateEntityFromDTO(dto, repartidor);
        Repartidor actualizado = repartidorRepository.save(repartidor);

        return repartidorMapper.toDetalleDTO(actualizado);
    }

    @Transactional
    public RepartidorDetalleDTO cambiarEstado(Long id, Boolean activo) {
        log.info("Cambiando estado del repartidor ID: {} a {}", id, activo ? "ACTIVO" : "INACTIVO");

        Repartidor repartidor = repartidorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Repartidor no encontrado con ID: " + id
                ));

        repartidor.setActivo(activo);
        Repartidor actualizado = repartidorRepository.save(repartidor);

        return repartidorMapper.toDetalleDTO(actualizado);
    }

    @Transactional
    public void eliminar(Long id) {
        log.info("Eliminando repartidor ID: {}", id);

        if (!repartidorRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Repartidor no encontrado con ID: " + id
            );
        }

        repartidorRepository.deleteById(id);
    }
}