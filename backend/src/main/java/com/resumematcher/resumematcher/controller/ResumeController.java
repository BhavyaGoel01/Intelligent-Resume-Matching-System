package com.resumematcher.resumematcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.resumematcher.resumematcher.model.Resume;
import com.resumematcher.resumematcher.service.ResumeService;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend (Vite default port)
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    /**
     * POST /upload
     * Accepts multipart file upload from React frontend.
     * Saves file to disk, extracts text, stores in DB.
     *
     * React sends: FormData with key "file" and "email"
     * Returns: Saved Resume object with ID
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "email", required = false) String email) {
        try {
            // Validate file is not empty
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body("Please select a file to upload.");
            }

            // Save the resume and extract text (email is optional for backward compatibility)
            Resume savedResume = resumeService.saveResume(file, email);

            return ResponseEntity.ok(savedResume);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Failed to upload resume: " + e.getMessage());
        }
    }

    /**
     * GET /resumes
     * Returns all uploaded resumes (useful for dropdown selection).
     */
    @GetMapping("/resumes")
    public ResponseEntity<List<Resume>> getAllResumes() {
        return ResponseEntity.ok(resumeService.findAll());
    }

    /**
     * GET /resumes/{id}
     * Returns a specific resume by ID.
     */
    @GetMapping("/resumes/{id}")
    public ResponseEntity<?> getResume(@PathVariable Long id) {
        return resumeService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}