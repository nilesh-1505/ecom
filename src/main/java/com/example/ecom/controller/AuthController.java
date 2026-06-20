package com.example.ecom.controller;

import com.example.ecom.dto.AuthRequests.*;
import com.example.ecom.entity.User;
import com.example.ecom.security.JwtTokenProvider;
import com.example.ecom.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            User registeredUser = userService.registerUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getPhoneNumber()
            );
            return ResponseEntity.ok("User registered successfully with ID: " + registeredUser.getId());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            User user = userService.getUserByEmail(request.getEmail());
            Set<String> roles = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .email(user.getEmail())
                    .userId(user.getId())
                    .roles(roles)
                    .build());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }
}
