package org.example.quickbite.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pedido {

    public enum EstadoPedido {
        PENDIENTE,
        EN_PREPARACION,
        EN_CAMINO,
        ENTREGADO,
        CANCELADO
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fecha_pedido", nullable = false)
    private LocalDateTime fechaPedido;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private EstadoPedido estado = EstadoPedido.PENDIENTE;

    @Column(nullable = false, precision = 10, scale = 2)
    @Builder.Default
    private BigDecimal total = BigDecimal.ZERO;

    @Column(length = 500)
    private String observaciones;

    // Dirección de entrega
    @Column(name = "direccion_entrega", nullable = false, length = 300)
    private String direccionEntrega;

    @Column(name = "ciudad_entrega", length = 100)
    private String ciudadEntrega;

    @Column(name = "codigo_postal_entrega", length = 10)
    private String codigoPostalEntrega;

    @Column(name = "provincia_entrega", length = 100)
    private String provinciaEntrega;

    @Column(name = "pais_entrega", length = 100)
    private String paisEntrega;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "repartidor_id")
    private Repartidor repartidor;

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<DetallePedido> detalles = new ArrayList<>();

    /**
     * Calcula el total del pedido sumando los subtotales de todos los detalles
     */
    public void calcularTotal() {
        if (detalles == null || detalles.isEmpty()) {
            this.total = BigDecimal.ZERO;
            return;
        }

        this.total = detalles.stream()
                .map(detalle -> {
                    // Asegurar que el subtotal esté calculado
                    if (detalle.getSubtotal() == null) {
                        detalle.calcularSubtotal();
                    }
                    return detalle.getSubtotal();
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}