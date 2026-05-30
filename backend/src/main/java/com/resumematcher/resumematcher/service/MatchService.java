package com.resumematcher.resumematcher.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.resumematcher.resumematcher.model.Job;
import com.resumematcher.resumematcher.model.Resume;
import com.resumematcher.resumematcher.repository.JobRepository;
import com.resumematcher.resumematcher.repository.ResumeRepository;

import java.util.*;

@Service
public class MatchService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private EmailService emailService;

    // Threshold for automatic selection email (60%)
    private static final double SELECTION_THRESHOLD = 60.0;

    /**
     * CORE MATCHING ALGORITHM
     *
     * How it works:
     * 1. Fetch resume text and job description from DB
     * 2. Extract individual keywords from both texts
     * 3. Find how many job keywords appear in the resume
     * 4. Calculate match percentage = (matched / total job keywords) * 100
     *
     * Returns a double value like 75.5 (meaning 75.5% match)
     */
    public double calculateMatch(Long resumeId, Long jobId) {

        // Step 1: Fetch resume and job from database
        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found with ID: " + resumeId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));

        // Step 2: Get texts and convert to lowercase for fair comparison
        String resumeText = resume.getExtractedText().toLowerCase();
        String jobText = job.getDescription().toLowerCase();

        // Step 3: Extract keywords from job description
        Set<String> jobKeywords = extractKeywords(jobText);

        // Step 4: Count how many job keywords appear in the resume
        int matchedCount = 0;
        for (String keyword : jobKeywords) {
            if (resumeText.contains(keyword)) {
                matchedCount++;
            }
        }

        // Step 5: Calculate percentage
        if (jobKeywords.isEmpty()) {
            return 0.0;
        }

        double percentage = ((double) matchedCount / jobKeywords.size()) * 100;

        // Round to 2 decimal places
        double finalPercentage = Math.round(percentage * 100.0) / 100.0;

        // Step 6: Auto-send selection email if match >= 60%
        if (finalPercentage >= SELECTION_THRESHOLD) {
            String candidateEmail = resume.getCandidateEmail();
            if (candidateEmail != null && !candidateEmail.isEmpty()) {
                try {
                    emailService.sendSelectionEmail(candidateEmail);
                    System.out.println("Auto-selection email sent to: " + candidateEmail + " (Match: " + finalPercentage + "%)");
                } catch (Exception e) {
                    // Log error but don't fail the match calculation
                    System.err.println("Failed to send selection email: " + e.getMessage());
                }
            }
        }

        return finalPercentage;
    }

    /**
     * Extract meaningful keywords from a text.
     *
     * - Splits by spaces and punctuation
     * - Removes common "stop words" (the, and, is, etc.)
     * - Keeps only words with 3+ characters (short words rarely matter)
     */
    private Set<String> extractKeywords(String text) {

        // Common English words to ignore (stop words)
        Set<String> stopWords = new HashSet<>(Arrays.asList(
            "the", "and", "for", "are", "but", "not", "you", "all",
            "can", "her", "was", "one", "our", "out", "day", "get",
            "has", "him", "his", "how", "its", "may", "new", "now",
            "old", "see", "two", "way", "who", "boy", "did", "this",
            "that", "with", "have", "from", "they", "will", "been",
            "said", "each", "which", "their", "time", "would", "there",
            "could", "other", "into", "than", "then", "well", "also",
            "more", "very", "when", "come", "here", "just", "like",
            "long", "make", "many", "over", "such", "take", "them"
        ));

        Set<String> keywords = new HashSet<>();

        // Split text by spaces, punctuation, and special characters
        String[] words = text.split("[\\s\\W]+");

        for (String word : words) {
            word = word.trim().toLowerCase();
            // Only include words with 3+ characters that aren't stop words
            if (word.length() >= 3 && !stopWords.contains(word)) {
                keywords.add(word);
            }
        }

        return keywords;
    }

    /**
     * Get matched AND missing keywords for detailed breakdown.
     * Used for the detailed result view.
     */
    public Map<String, Object> getDetailedMatch(Long resumeId, Long jobId) {

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found with ID: " + resumeId));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with ID: " + jobId));

        String resumeText = resume.getExtractedText().toLowerCase();
        String jobText = job.getDescription().toLowerCase();

        Set<String> jobKeywords = extractKeywords(jobText);
        Set<String> matchedKeywords = new HashSet<>();
        Set<String> missingKeywords = new HashSet<>();

        for (String keyword : jobKeywords) {
            if (resumeText.contains(keyword)) {
                matchedKeywords.add(keyword);
            } else {
                missingKeywords.add(keyword);
            }
        }

        double percentage = jobKeywords.isEmpty() ? 0.0
                : Math.round(((double) matchedKeywords.size() / jobKeywords.size()) * 10000.0) / 100.0;

        Map<String, Object> result = new HashMap<>();
        result.put("resumeId", resumeId);
        result.put("jobId", jobId);
        result.put("resumeFileName", resume.getFileName());
        result.put("jobTitle", job.getTitle());
        result.put("matchPercentage", percentage);
        result.put("totalJobKeywords", jobKeywords.size());
        result.put("matchedCount", matchedKeywords.size());
        result.put("matchedKeywords", matchedKeywords);
        result.put("missingKeywords", missingKeywords);

        return result;
    }
}