package com.fedelei.clinica_dental.configuration;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;
    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Permitir sin validación JWT a rutas públicas
        String requestPath = request.getRequestURI();
        if (requestPath.startsWith("/auth/")) {
            logger.info("Skipping JWT validation for public path: {}", requestPath);
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("No or invalid Authorization header for request {}", requestPath);
            filterChain.doFilter(request, response);
            return;
        }
        jwt = authHeader.substring(7);
    userEmail = jwtService.extractUsername(jwt);
    logger.info("Authorization header present for request {}; extracted username: {}", requestPath, userEmail != null ? userEmail : "<null>");

        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                if (jwtService.isTokenValid(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authenticationToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                    logger.info("Authenticated user '{}' for request {} with authorities: {}", userEmail, requestPath, userDetails.getAuthorities());
                } else {
                    logger.warn("Token validation failed for user '{}' on request {}", userEmail, requestPath);
                }
            } catch (Exception e) {
                // Log error pero permite que la petición continúe
                // El security context estará vacío y el endpoint rechazará si requiere autenticación
                logger.warn("Failed to authenticate user '{}' from JWT: {}", userEmail, e.getMessage());
                logger.debug("Authentication exception stacktrace:", e);
            }
        }
        filterChain.doFilter(request, response);
    }
}
