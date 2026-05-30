package com.resumematcher.resumematcher.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resumematcher.resumematcher.model.Job;
import com.resumematcher.resumematcher.repository.JobRepository;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    /**
     * Save a new job description to the database.
     */
    public Job saveJob(Job job) {
        // Automatically set the timestamp when job is created
        job.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return jobRepository.save(job);
    }

    /**
     * Find a job by its ID.
     */
    public Optional<Job> findById(Long id) {
        return jobRepository.findById(id);
    }

    /**
     * Get all saved jobs.
     */
    public List<Job> findAll() {
        return jobRepository.findAll();
    }
}