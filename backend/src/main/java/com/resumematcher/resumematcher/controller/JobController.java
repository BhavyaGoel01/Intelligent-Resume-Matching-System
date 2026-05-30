package com.resumematcher.resumematcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.resumematcher.resumematcher.model.Job;
import com.resumematcher.resumematcher.service.JobService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend (Vite default port)
public class JobController {

    @Autowired
    private JobService jobService;

    /**
     * POST /job
     * Save a new job description.
     *
     * React sends JSON body: { "title": "...", "description": "..." }
     * Returns: Saved Job object with generated ID
     */
    @PostMapping("/job")
    public ResponseEntity<?> addJob(@RequestBody Job job) {
        try {
            // Validate required fields
            if (job.getTitle() == null || job.getTitle().isBlank()) {
                return ResponseEntity.badRequest().body("Job title is required.");
            }
            if (job.getDescription() == null || job.getDescription().isBlank()) {
                return ResponseEntity.badRequest().body("Job description is required.");
            }

            Job savedJob = jobService.saveJob(job);
            return ResponseEntity.ok(savedJob);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to save job: " + e.getMessage());
        }
    }

    /**
     * GET /jobs
     * Returns all saved job descriptions.
     */
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.findAll());
    }

    /**
     * GET /jobs/{id}
     * Returns a specific job by ID.
     */
    @GetMapping("/jobs/{id}")
    public ResponseEntity<?> getJob(@PathVariable Long id) {
        return jobService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}