package com.resumematcher.resumematcher.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.resumematcher.resumematcher.dto.AuthResponse;
import com.resumematcher.resumematcher.dto.LoginRequest;
import com.resumematcher.resumematcher.dto.RegisterRequest;
import com.resumematcher.resumematcher.model.User;
import com.resumematcher.resumematcher.repository.Userrepository;
import com.resumematcher.resumematcher.security.JwtUtil;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * AuthService handles all authentication business logic:
 *
 * register() → Validate input → Hash password → Save user → Return JWT token
 * login()    → Find user by email → Verify password → Return JWT token
 */
@Service
public class AuthService {

    @Autowired
    private Userrepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // BCrypt

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * REGISTER a new user.
     *
     * Steps:
     * 1. Check email not already taken
     * 2. Hash the password with BCrypt
     * 3. Save User to database
     * 4. Generate and return JWT token
     */
    public AuthResponse register(RegisterRequest request) {

        // Step 1: Validate inputs
        if (request.getName() == null || request.getName().isBlank()) {
            throw new RuntimeException("Name is required.");
        }
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required.");
        }
        if (request.getPassword() == null || request.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters.");
        }

        // Step 2: Check if email already registered
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered. Please login instead.");
        }

        // Step 3: Create new User and hash the password
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash
        user.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // Step 4: Save to database
        User savedUser = userRepository.save(user);

        // Step 5: Generate JWT token for immediate login after registration
        String token = jwtUtil.generateToken(savedUser.getEmail());

        return new AuthResponse(
                token,
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                "Registration successful! Welcome, " + savedUser.getName() + "!"
        );
    }

    /**
     * LOGIN an existing user.
     *
     * Steps:
     * 1. Find user by email
     * 2. Verify password matches BCrypt hash
     * 3. Generate and return JWT token
     */
    public AuthResponse login(LoginRequest request) {

        // Step 1: Validate inputs
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required.");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required.");
        }

        // Step 2: Look up user by email
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("No account found with this email. Please register first."));

        // Step 3: Verify password (BCrypt compare)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect password. Please try again.");
        }

        // Step 4: Generate JWT token
        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(
                token,
                user.getId(),
                user.getName(),
                user.getEmail(),
                "Login successful! Welcome back, " + user.getName() + "!"
        );
    }
}