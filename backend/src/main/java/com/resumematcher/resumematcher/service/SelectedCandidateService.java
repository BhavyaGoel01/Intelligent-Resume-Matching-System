package com.resumematcher.resumematcher.service;

import com.resumematcher.resumematcher.model.SelectedCandidate;
import com.resumematcher.resumematcher.repository.SelectedCandidateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class SelectedCandidateService {

    @Autowired private SelectedCandidateRepository repo;

    public SelectedCandidate save(Map<String, Object> body) {
        SelectedCandidate sc = new SelectedCandidate();
        sc.setResumeId(toLong(body.get("resumeId")));
        sc.setResumeFileName((String) body.getOrDefault("resumeFileName", ""));
        sc.setCandidateEmail((String) body.getOrDefault("candidateEmail", ""));
        sc.setJobId(toLong(body.get("jobId")));
        sc.setJobTitle((String) body.getOrDefault("jobTitle", ""));
        sc.setMatchPercentage(toDouble(body.get("matchPercentage")));
        sc.setMatchedSkills((String) body.getOrDefault("matchedSkills", ""));
        sc.setMissingSkills((String) body.getOrDefault("missingSkills", ""));
        sc.setSavedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return repo.save(sc);
    }

    public List<SelectedCandidate> findByJobId(Long jobId) { return repo.findByJobId(jobId); }
    public List<SelectedCandidate> findAll()               { return repo.findAll(); }

    private Long   toLong(Object v)   { return v == null ? null : Long.parseLong(v.toString()); }
    private double toDouble(Object v) { return v == null ? 0.0 : Double.parseDouble(v.toString()); }
}