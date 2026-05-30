package com.resumematcher.resumematcher.controller;

import com.resumematcher.resumematcher.model.Job;
import com.resumematcher.resumematcher.model.Resume;
import com.resumematcher.resumematcher.model.User;
import com.resumematcher.resumematcher.repository.JobRepository;
import com.resumematcher.resumematcher.repository.ResumeRepository;
import com.resumematcher.resumematcher.repository.Userrepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class AdminController {

    @Autowired private Userrepository   userRepo;
    @Autowired private ResumeRepository resumeRepo;
    @Autowired private JobRepository    jobRepo;

    // ════════════════════════════════════════════════
    //  USERS
    // ════════════════════════════════════════════════

    /** GET /admin/users — list all registered HR users */
    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepo.findAll());
    }

    /** DELETE /admin/users/{id} — remove an HR user */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepo.existsById(id))
            return ResponseEntity.notFound().build();
        userRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "User " + id + " deleted"));
    }

    // ════════════════════════════════════════════════
    //  RESUMES
    // ════════════════════════════════════════════════

    /** GET /admin/resumes — all uploaded resumes (same as /resumes but under /admin namespace) */
    @GetMapping("/resumes")
    public ResponseEntity<List<Resume>> getAllResumes() {
        return ResponseEntity.ok(resumeRepo.findAll());
    }

    /** DELETE /admin/resumes/{id} — permanently remove a resume record */
    @DeleteMapping("/resumes/{id}")
    public ResponseEntity<?> deleteResume(@PathVariable Long id) {
        if (!resumeRepo.existsById(id))
            return ResponseEntity.notFound().build();
        resumeRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Resume " + id + " deleted"));
    }

    // ════════════════════════════════════════════════
    //  JOBS
    // ════════════════════════════════════════════════

    /** GET /admin/jobs — all job descriptions */
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobRepo.findAll());
    }

    /** DELETE /admin/jobs/{id} — remove a job description */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id) {
        if (!jobRepo.existsById(id))
            return ResponseEntity.notFound().build();
        jobRepo.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Job " + id + " deleted"));
    }
}