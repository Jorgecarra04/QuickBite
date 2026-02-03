package org.example.quickbite.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "repartidores")
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Repartidor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellidos;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(nullable = false, length = 9)
    private String telefono;

    @Column(name = "matricula_vehiculo", nullable = false, length = 20)
    private String matriculaVehiculo;

    @Column(nullable = false)
    @Builder.Default
    private Boolean activo = true;

    // Relación 1:N con Pedido
    @OneToMany(mappedBy = "repartidor")
    @Builder.Default
    private List<Pedido> pedidos = new ArrayList<>();
}