package org.example.quickbite.repository;

import org.example.quickbite.model.Repartidor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RepartidorRepository extends JpaRepository<Repartidor, Long> {
    boolean existsByEmail(String email);

    Optional<Repartidor> findByEmail(String email);

    Page<Repartidor> findByActivo(Boolean activo, Pageable pageable);

    List<Repartidor> findByActivoTrue();
}