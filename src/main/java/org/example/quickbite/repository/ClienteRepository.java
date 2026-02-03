package org.example.quickbite.repository;

import org.example.quickbite.model.Cliente;
import org.example.quickbite.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Carga clientes con usuario en una sola consulta
    @EntityGraph(attributePaths = {"usuario"})
    Page<Cliente> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"usuario"})
    Optional<Cliente> findByUsuario(Usuario usuario);

    @EntityGraph(attributePaths = {"usuario"})
    Optional<Cliente> findByUsuarioUsername(String username);

    boolean existsByUsuario(Usuario usuario);

    @EntityGraph(attributePaths = {"usuario"})
    @Query("SELECT c FROM Cliente c WHERE " +
            "LOWER(c.usuario.nombre) LIKE LOWER(CONCAT('%', :texto, '%')) OR " +
            "LOWER(c.usuario.apellidos) LIKE LOWER(CONCAT('%', :texto, '%'))")
    Page<Cliente> buscarPorNombreOApellidos(@Param("texto") String texto, Pageable pageable);
}