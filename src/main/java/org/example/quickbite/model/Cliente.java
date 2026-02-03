package org.example.quickbite.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clientes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación 1:1 con Usuario
    @OneToOne
    @JoinColumn(name = "usuario_id", unique = true, nullable = false)
    private Usuario usuario;

    @Column(length = 9)
    private String telefono;

    @Column(length = 300)
    private String direccion;

    @Column(length = 100)
    private String ciudad;

    @Column(name = "codigo_postal", length = 5)
    private String codigoPostal;

    @Column(length = 100)
    private String provincia;

    @Column(length = 100)
    private String pais;

    // Relación 1:N con Pedido
    @OneToMany(mappedBy = "cliente", cascade = CascadeType.ALL)
    private List<Pedido> pedidos = new ArrayList<>();

    // Métodos helper para obtener datos del usuario
    public String getNombre() {
        return usuario != null ? usuario.getNombre() : null;
    }

    public String getApellidos() {
        return usuario != null ? usuario.getApellidos() : null;
    }

    public String getEmail() {
        return usuario != null ? usuario.getEmail() : null;
    }

    public String getNombreCompleto() {
        if (usuario == null) return "";
        return (usuario.getNombre() + " " + usuario.getApellidos()).trim();
    }
}