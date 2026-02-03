package org.example.quickbite.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.quickbite.dto.request.LoginRequest;
import org.example.quickbite.dto.request.RegisterRequest;
import org.example.quickbite.dto.response.AuthResponse;
import org.example.quickbite.exception.BusinessException;
import org.example.quickbite.model.Cliente;
import org.example.quickbite.model.Usuario;
import org.example.quickbite.repository.ClienteRepository;
import org.example.quickbite.repository.UsuarioRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UsuarioRepository usuarioRepository;
    private final ClienteRepository clienteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registrando nuevo usuario: {}", request.getUsername());

        if (usuarioRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("El username ya está en uso");
        }

        if (usuarioRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException("El email ya está registrado");
        }

        Usuario usuario = Usuario.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nombre(request.getNombre())
                .apellidos(request.getApellidos())
                .role(Usuario.Role.USER)
                .activo(true)
                .fechaRegistro(LocalDateTime.now())
                .build();

        Usuario savedUsuario = usuarioRepository.save(usuario);

        // CREAR CLIENTE AUTOMÁTICAMENTE
        if (savedUsuario.getRole() == Usuario.Role.USER) {
            Cliente cliente = Cliente.builder()
                    .usuario(savedUsuario)
                    .telefono(request.getTelefono())
                    .build();
            clienteRepository.save(cliente);
            log.info("Cliente creado automáticamente para usuario: {}", savedUsuario.getUsername());
        }

        String jwtToken = jwtService.generateToken(savedUsuario);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(savedUsuario.getUsername())
                .email(savedUsuario.getEmail())
                .role(savedUsuario.getRole().name())
                .mensaje("Usuario registrado exitosamente")
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        log.info("Intentando login para usuario: {}", request.getUsername());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        Usuario usuario = usuarioRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));

        String jwtToken = jwtService.generateToken(usuario);

        return AuthResponse.builder()
                .token(jwtToken)
                .username(usuario.getUsername())
                .email(usuario.getEmail())
                .role(usuario.getRole().name())
                .mensaje("Login exitoso")
                .build();
    }
}