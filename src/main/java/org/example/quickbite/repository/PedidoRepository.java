package org.example.quickbite.repository;

import org.example.quickbite.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    List<Pedido> findByClienteIdOrderByFechaPedidoDesc(Long clienteId);

    List<Pedido> findByRepartidorIdOrderByFechaPedidoDesc(Long repartidorId);

    List<Pedido> findByEstadoOrderByFechaPedidoDesc(Pedido.EstadoPedido estado);

    @Query("SELECT COUNT(p) FROM Pedido p " +
            "WHERE p.repartidor.id = :repartidorId " +
            "AND p.estado IN ('PENDIENTE', 'EN_PREPARACION', 'EN_CAMINO')")
    long countPedidosPendientesByRepartidor(@Param("repartidorId") Long repartidorId);
}