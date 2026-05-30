package com.resumematcher.resumematcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.resumematcher.resumematcher.model.Job;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    // JpaRepository gives us: save(), findById(), findAll(), deleteById() for free!
}