package com.resumematcher.resumematcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.resumematcher.resumematcher.model.Resume;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {
    // JpaRepository gives us: save(), findById(), findAll(), deleteById() for free!
}
