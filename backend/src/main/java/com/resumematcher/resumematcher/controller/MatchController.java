package com.resumematcher.resumematcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.resumematcher.resumematcher.service.MatchService;

import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend (Vite default port)
public class MatchController {

    @Autowired
    private MatchService matchService;

    /**
     * GET /match/{resumeId}/{jobId}
     * Calculate simple match percentage between a resume and a job.
     *
     * This is the endpoint your React Result.jsx calls:
     * axios.get("http://localhost:8080/match/1/1")
     *
     * Returns: a double like 75.5 (meaning 75.5% match)
     */
    @GetMapping("/match/{resumeId}/{jobId}")
    public ResponseEntity<?> getMatchPercentage(
            @PathVariable Long resumeId,
            @PathVariable Long jobId) {
        try {
            double percentage = matchService.calculateMatch(resumeId, jobId);
            return ResponseEntity.ok(percentage);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error during matching: " + e.getMessage());
        }
    }

    /**
     * GET /match/details/{resumeId}/{jobId}
     * Returns a DETAILED match report including:
     * - Match percentage
     * - Matched keywords
     * - Missing keywords (skills to improve!)
     * - Resume and job info
     *
     * Perfect for a detailed results page.
     */
    @GetMapping("/match/details/{resumeId}/{jobId}")
    public ResponseEntity<?> getDetailedMatch(
            @PathVariable Long resumeId,
            @PathVariable Long jobId) {
        try {
            Map<String, Object> details = matchService.getDetailedMatch(resumeId, jobId);
            return ResponseEntity.ok(details);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error during detailed matching: " + e.getMessage());
        }
    }
}