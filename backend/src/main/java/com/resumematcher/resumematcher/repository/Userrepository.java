package com.resumematcher.resumematcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.resumematcher.resumematcher.model.User;

import java.util.Optional;

@Repository
public interface Userrepository extends JpaRepository<User, Long> {

    // Find user by email (used for login)
    Optional<User> findByEmail(String email);

    // Check if email already exists (used for register)
    boolean existsByEmail(String email);
}