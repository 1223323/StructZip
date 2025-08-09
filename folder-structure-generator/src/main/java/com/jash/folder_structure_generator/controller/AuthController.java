package com.jash.folder_structure_generator.controller;

import com.jash.folder_structure_generator.dto.AuthRequest;
import com.jash.folder_structure_generator.dto.AuthResponse;
import com.jash.folder_structure_generator.model.User;
import com.jash.folder_structure_generator.security.JwtUtil;
import com.jash.folder_structure_generator.service.UserService;
import com.jash.folder_structure_generator.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final EmailService emailService;

    @Autowired
    public AuthController(UserService userService, JwtUtil jwtUtil, EmailService emailService) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody AuthRequest request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Email is required");
            }
            if (request.getPassword() == null || request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body("Password must be at least 6 characters");
            }

            // Check if user already exists
            if (userService.existsByUsername(request.getUsername())) {
                return ResponseEntity.badRequest().body("Username already exists");
            }
            if (userService.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Create new user
            User user = new User();
            user.setUsername(request.getUsername().trim());
            user.setEmail(request.getEmail().trim());
            user.setPassword(request.getPassword());

            User savedUser = userService.createUser(user);

            // Generate token
            String token = jwtUtil.generateToken(savedUser.getUsername());

            // Send welcome email
            emailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getUsername());

            return ResponseEntity.ok(new AuthResponse(token, savedUser.getUsername(), "User registered successfully"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            // Validate input
            if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Username is required");
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Password is required");
            }

            // Find user
            User user = userService.findByUsername(request.getUsername().trim())
                    .orElse(null);

            if (user == null) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }

            // Validate password
            if (!userService.validatePassword(request.getPassword(), user.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid username or password");
            }

            // Generate token
            String token = jwtUtil.generateToken(user.getUsername());

            // Send login notification email
            emailService.sendLoginNotification(user.getEmail(), user.getUsername());

            return ResponseEntity.ok(new AuthResponse(token, user.getUsername(), "Login successful"));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }
}