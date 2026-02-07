package org.example.quickbite.repository;

import org.example.quickbite.model.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoriaRepository extends JpaRepository<Categoria, Long> {

    Optional<Categoria> findByNombre(String nombre);

    @Query("SELECT c FROM Categoria c LEFT JOIN FETCH c.productos")
    List<Categoria> findAllWithProductos();
}