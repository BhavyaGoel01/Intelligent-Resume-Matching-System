package com.resumematcher.resumematcher.controller;

import com.resumematcher.resumematcher.model.SelectedCandidate;
import com.resumematcher.resumematcher.service.SelectedCandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/selected")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SelectedCandidateController {

    @Autowired private SelectedCandidateService service;

    /** POST /selected/save  — called by Results.jsx after auto-send */
    @PostMapping("/save")
    public ResponseEntity<?> save(@RequestBody Map<String, Object> body) {
        try {
            return ResponseEntity.ok(service.save(body));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    /** GET /selected/all  — all selected candidates (for PDF report) */
    @GetMapping("/all")
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(service.findAll());
    }

    /** GET /selected/job/{jobId}  — selected for a specific job */
    @GetMapping("/job/{jobId}")
    public ResponseEntity<?> getByJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(service.findByJobId(jobId));
    }
}