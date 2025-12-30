package com.assuredfarming.app.controller;

import com.assuredfarming.app.config.JwtUtils;
import com.assuredfarming.app.dto.AuthRequest;
import com.assuredfarming.app.dto.AuthResponse;
import com.assuredfarming.app.dto.RegisterRequest;
import com.assuredfarming.app.model.User;
import com.assuredfarming.app.model.UserRole;
import com.assuredfarming.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtils jwtUtils,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    // ✅ LOGIN (401 only, never 500)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {

        try {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(),
                                    request.getPassword()
                            )
                    );

            UserDetails userDetails =
                    (UserDetails) authentication.getPrincipal();

            User user = userService
                    .getUserByEmail(userDetails.getUsername())
                    .orElseThrow();

            String token =
                    jwtUtils.generateToken(
                            user.getEmail(),
                            user.getRole().name()
                    );

            return ResponseEntity.ok(
                    new AuthResponse(
                            token,
                            user.getUserId(),
                            user.getName(),
                            user.getEmail(),
                            user.getRole()
                    )
            );

        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }
    }

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword()); // RAW here
        user.setRole(UserRole.valueOf(request.getRole().toUpperCase()));
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        User savedUser = userService.createUser(user); // BCrypt happens here

        String token =
                jwtUtils.generateToken(
                        savedUser.getEmail(),
                        savedUser.getRole().name()
                );

        return ResponseEntity.ok(
                new AuthResponse(
                        token,
                        savedUser.getUserId(),
                        savedUser.getName(),
                        savedUser.getEmail(),
                        savedUser.getRole()
                )
        );
    }
}
