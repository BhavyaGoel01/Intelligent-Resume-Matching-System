package com.resumematcher.resumematcher.repository;

import com.resumematcher.resumematcher.model.SelectedCandidate;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SelectedCandidateRepository extends JpaRepository<SelectedCandidate, Long> {
    List<SelectedCandidate> findByJobId(Long jobId);
}