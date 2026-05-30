package com.resumematcher.resumematcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.resumematcher.resumematcher.dto.AuthResponse;
import com.resumematcher.resumematcher.dto.LoginRequest;
import com.resumematcher.resumematcher.dto.RegisterRequest;
import com.resumematcher.resumematcher.service.AuthService;
import com.resumematcher.resumematcher.service.EmailService;

import java.util.Collections;
import java.util.Map;

/**
 * AuthController exposes public authentication endpoints:
 *
 * POST /auth/register  → Register new user
 * POST /auth/login     → Login existing user
 * GET  /auth/me        → Validate token
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    @Autowired
    private EmailService emailService;

    /**
     * Helper endpoint used during development to verify that the mail configuration
     * works.  It sends a dummy selection notification to the address hardcoded
     * below.  You can hit this manually (e.g. via browser or curl) and look for
     * the message in your inbox.  In production the frontend or other services
     * should call the POST /auth/send-email endpoint instead.
     */
    @RestController
    public class TestController {

        @Autowired
        private EmailService emailService;

        @GetMapping("/test-mail")
        public String testMail() {
            emailService.sendSelectionEmail("ankitagaikwad073@gmail.com");
            return "Mail Sent Successfully!";
        }
    }

    /**
     * Generic email-sending endpoint.  The frontend can POST a JSON body with a
     * single field `email` to trigger the selection message.  This keeps the
     * mail logic on the server and allows the Results page to ask the backend
     * to notify a candidate once you decide who should move forward.
     */
    @PostMapping("/send-email")
    public ResponseEntity<?> sendEmail(@RequestBody Map<String, String> payload) {
        String to = payload.get("email");
        if (to == null || to.isEmpty()) {
            return ResponseEntity.badRequest().body(Collections.singletonMap("error", "Email address is required"));
        }
        try {
            emailService.sendSelectionEmail(to);
            return ResponseEntity.ok(Collections.singletonMap("message", "Email sent to " + to));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Collections.singletonMap("error", "Failed to send email: " + e.getMessage()));
        }
    }
    /**
     * POST /auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    /**
     * POST /auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(401)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    /**
     * GET /auth/me
     * Requires Authorization: Bearer <token>
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        try {
            return ResponseEntity.ok(
                    Collections.singletonMap("message", "Token is valid"));
        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(Collections.singletonMap("error", "Unauthorized"));
        }
        
    }
}