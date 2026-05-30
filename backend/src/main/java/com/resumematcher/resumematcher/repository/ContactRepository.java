package com.resumematcher.resumematcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.resumematcher.resumematcher.model.ContactMessage;


public interface ContactRepository extends JpaRepository<ContactMessage, Long> {
}