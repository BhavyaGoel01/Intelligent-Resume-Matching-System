package com.resumematcher.resumematcher.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.util.Date;

/**
 * JwtUtil handles:
 * 1. Generating a JWT token when user logs in
 * 2. Extracting the email from a token
 * 3. Validating that a token is genuine and not expired
 */
@Component
public class JwtUtil {

    // Read secret key and expiry from application.properties
    @Value("${jwt.secret}")
    private String secret;

    @Value("${jwt.expiration}")
    private long expiration; // milliseconds (86400000 = 24 hours)

    // Build a secure signing key from the secret string
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Generate a JWT token for a given email.
     * Called after successful login or register.
     */
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)                              // Store email in token
                .setIssuedAt(new Date())                        // Token created now
                .setExpiration(new Date(System.currentTimeMillis() + expiration)) // Expires in 24h
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // Sign with our secret
                .compact();
    }

    /**
     * Extract the email from a JWT token.
     * Used to identify which user is making a request.
     */
    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    /**
     * Check if a token is valid:
     * - Has not been tampered with
     * - Has not expired
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Token is invalid, expired, or malformed
            return false;
        }
    }
}