package org.example.quickbite.repository;

import org.example.quickbite.model.Producto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // OPTIMIZADO: Carga productos con restaurante y categoría en una sola consulta
    @EntityGraph(attributePaths = {"restaurante", "categoria"})
    Page<Producto> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"restaurante", "categoria"})
    Optional<Producto> findByNombre(String nombre);

    @EntityGraph(attributePaths = {"restaurante", "categoria"})
    @Query("SELECT p FROM Producto p WHERE " +
            "(:restauranteId IS NULL OR p.restaurante.id = :restauranteId) AND " +
            "(:categoriaId IS NULL OR p.categoria.id = :categoriaId) AND " +
            "(:disponible IS NULL OR p.disponible = :disponible)")
    Page<Producto> buscarConFiltros(
            @Param("restauranteId") Long restauranteId,
            @Param("categoriaId") Long categoriaId,
            @Param("disponible") Boolean disponible,
            Pageable pageable
    );
}