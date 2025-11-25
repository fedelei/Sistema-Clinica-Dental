package com.fedelei.clinica_dental.authentication;

import com.fedelei.clinica_dental.configuration.JwtService;
import com.fedelei.clinica_dental.entity.Role;
import com.fedelei.clinica_dental.entity.User;
import com.fedelei.clinica_dental.repository.IUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final IUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
                // Determinar role (por seguridad, validar y default a USER)
                Role role = Role.USER;
                try{
                        if(request.getRole() != null) role = Role.valueOf(request.getRole().toUpperCase());
                }catch(Exception e){
                        role = Role.USER;
                }

                var user = User.builder()
                                .firstname(request.getFirstname())
                                .lastname(request.getLastname())
                                .email(request.getEmail())
                                .password(passwordEncoder.encode(request.getPassword()))
                                .role(role)
                                .build();

        userRepository.save(user);
        // incluir el role en las claims para que el frontend pueda leerlo del token
        var claims = new java.util.HashMap<String, Object>();
        claims.put("role", user.getRole().name());
        var jwt = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwt)
                .build();
    }

    public AuthenticationResponse login(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        var user = userRepository.findFirstByEmail(request.getEmail())
                .orElseThrow();
        var claims = new java.util.HashMap<String, Object>();
        claims.put("role", user.getRole().name());
        var jwt = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwt)
                .build();

    }
}
