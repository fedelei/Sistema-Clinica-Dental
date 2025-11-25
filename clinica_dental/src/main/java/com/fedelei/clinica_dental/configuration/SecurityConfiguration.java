package com.fedelei.clinica_dental.configuration;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final AuthenticationProvider authenticationProvider;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
        .authorizeHttpRequests()
        .requestMatchers("/auth/**").permitAll()
        .requestMatchers("/turnos/check-availability").permitAll()
        // solo ADMIN puede crear/editar/borrar odontólogos
        .requestMatchers(HttpMethod.POST, "/odontologos/**").hasAuthority("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/odontologos/**").hasAuthority("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/odontologos/**").hasAuthority("ADMIN")
        .anyRequest().authenticated()
                .and()
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }
}
