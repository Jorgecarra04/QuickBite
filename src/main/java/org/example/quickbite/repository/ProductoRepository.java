package org.example.quickbite.repository;

import org.example.quickbite.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    List<Producto> findByRestauranteId(Long restauranteId);

    List<Producto> findByCategoriaId(Long categoriaId);

    Optional<Producto> findByNombre(String nombre);

    @Query("SELECT p FROM Producto p " +
            "WHERE (:restauranteId IS NULL OR p.restaurante.id = :restauranteId) " +
            "AND (:categoriaId IS NULL OR p.categoria.id = :categoriaId) " +
            "AND (:disponible IS NULL OR p.disponible = :disponible) " +
            "AND p.restaurante.activo = true")
    Page<Producto> findByFilters(
            @Param("restauranteId") Long restauranteId,
            @Param("categoriaId") Long categoriaId,
            @Param("disponible") Boolean disponible,
            Pageable pageable
    );
}