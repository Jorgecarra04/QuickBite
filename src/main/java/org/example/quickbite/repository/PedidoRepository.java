package org.example.quickbite.repository;

import org.example.quickbite.model.Pedido;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    // OPTIMIZADO: Carga pedidos con cliente y usuario en una sola consulta
    @EntityGraph(attributePaths = {"cliente", "cliente.usuario", "repartidor"})
    Page<Pedido> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"cliente", "cliente.usuario", "repartidor"})
    Page<Pedido> findByClienteId(Long clienteId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE " +
            "p.cliente.id = :clienteId AND " +
            "p.estado IN ('PENDIENTE', 'EN_PREPARACION', 'EN_CAMINO')")
    Long contarPedidosActivosDelCliente(@Param("clienteId") Long clienteId);

    @Query("SELECT COUNT(p) FROM Pedido p WHERE " +
            "p.repartidor.id = :repartidorId AND " +
            "p.estado = 'EN_CAMINO'")
    Long contarPedidosEnCaminoDelRepartidor(@Param("repartidorId") Long repartidorId);

    @EntityGraph(attributePaths = {"cliente", "cliente.usuario", "repartidor"})
    @Query("SELECT p FROM Pedido p WHERE " +
            "p.cliente.id = :clienteId AND " +
            "(:estado IS NULL OR p.estado = :estado)")
    Page<Pedido> buscarPorClienteYEstado(
            @Param("clienteId") Long clienteId,
            @Param("estado") Pedido.EstadoPedido estado,
            Pageable pageable
    );

    @EntityGraph(attributePaths = {"cliente", "cliente.usuario"})
    @Query("SELECT p FROM Pedido p WHERE " +
            "p.estado = 'EN_PREPARACION' AND " +
            "p.repartidor IS NULL")
    Page<Pedido> buscarPedidosSinRepartidor(Pageable pageable);
}