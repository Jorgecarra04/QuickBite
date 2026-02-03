package org.example.quickbite.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configure(http))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // Endpoints públicos de autenticación
                        .requestMatchers("/api/auth/**").permitAll()

                        // Recursos estáticos HTML, CSS, JS
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/admin.html",
                                "/login.html",
                                "/register.html",
                                "/*.css",
                                "/*.js",
                                "/favicon.ico"
                        ).permitAll()

                        // USUARIOS pueden ver su propio perfil
                        .requestMatchers("/api/clientes/mi-perfil").hasAnyRole("USER", "ADMIN")

                        // SOLO ADMIN puede gestionar clientes y repartidores
                        .requestMatchers("/api/clientes/**").hasRole("ADMIN")
                        .requestMatchers("/api/repartidores/**").hasRole("ADMIN")

                        // Endpoints de administración solo para ADMIN
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // Restaurantes, productos, categorías - todos los autenticados
                        .requestMatchers("/api/restaurantes/**").authenticated()
                        .requestMatchers("/api/productos/**").authenticated()
                        .requestMatchers("/api/categorias/**").authenticated()

                        // Pedidos - todos los autenticados
                        .requestMatchers("/api/pedidos/**").authenticated()

                        // Todos los demás endpoints requieren autenticación
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}