package com.example.transitops.auth.service;

import com.example.transitops.auth.dto.LoginRequest;
import com.example.transitops.auth.dto.LoginResponse;
import com.example.transitops.auth.dto.RegisterRequest;
import com.example.transitops.auth.entity.Role;
import com.example.transitops.auth.entity.User;
import com.example.transitops.auth.repository.RoleRepository;
import com.example.transitops.auth.repository.UserRepository;
import com.example.transitops.common.exception.UnauthorizedException;
import com.example.transitops.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/*
 * ============================================================
 * AUTHENTICATION SERVICE
 *
 * Responsibilities:
 * - User Authentication
 * - JWT Generation
 * - Password Verification
 *
 * Authorization is handled by Spring Security.
 * ============================================================
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public AuthServiceImpl(
            UserRepository userRepository,
            RoleRepository roleRepository,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        } catch (AuthenticationException ex) {
            throw new UnauthorizedException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("User not found"));

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().getRoleName())
                .build();
    }

    @Override
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UnauthorizedException("Email is already registered");
        }

        Role role = roleRepository.findByRoleName(request.getRole())
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setRoleName(request.getRole());
                    return roleRepository.save(newRole);
                });

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setEnabled(true);

        user = userRepository.save(user);

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().getRoleName())
                .build();
    }
}
