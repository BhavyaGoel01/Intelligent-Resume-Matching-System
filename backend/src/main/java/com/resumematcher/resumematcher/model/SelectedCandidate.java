package com.resumematcher.resumematcher.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "selected_candidates")
@Data @NoArgsConstructor @AllArgsConstructor
public class SelectedCandidate {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long   resumeId;
    private String resumeFileName;
    private String candidateEmail;
    private Long   jobId;
    private String jobTitle;
    private double matchPercentage;

    @Column(columnDefinition = "TEXT")
    private String matchedSkills;   // comma-separated

    @Column(columnDefinition = "TEXT")
    private String missingSkills;   // comma-separated

    private String savedAt;

	public SelectedCandidate(Long resumeId, String resumeFileName, String candidateEmail, Long jobId, String jobTitle,
			double matchPercentage, String matchedSkills, String missingSkills, String savedAt) {
		super();
		this.resumeId = resumeId;
		this.resumeFileName = resumeFileName;
		this.candidateEmail = candidateEmail;
		this.jobId = jobId;
		this.jobTitle = jobTitle;
		this.matchPercentage = matchPercentage;
		this.matchedSkills = matchedSkills;
		this.missingSkills = missingSkills;
		this.savedAt = savedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getResumeId() {
		return resumeId;
	}

	public void setResumeId(Long resumeId) {
		this.resumeId = resumeId;
	}

	public String getResumeFileName() {
		return resumeFileName;
	}

	public void setResumeFileName(String resumeFileName) {
		this.resumeFileName = resumeFileName;
	}

	public String getCandidateEmail() {
		return candidateEmail;
	}

	public void setCandidateEmail(String candidateEmail) {
		this.candidateEmail = candidateEmail;
	}

	public Long getJobId() {
		return jobId;
	}

	public void setJobId(Long jobId) {
		this.jobId = jobId;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public double getMatchPercentage() {
		return matchPercentage;
	}

	public void setMatchPercentage(double matchPercentage) {
		this.matchPercentage = matchPercentage;
	}

	public String getMatchedSkills() {
		return matchedSkills;
	}

	public void setMatchedSkills(String matchedSkills) {
		this.matchedSkills = matchedSkills;
	}

	public String getMissingSkills() {
		return missingSkills;
	}

	public void setMissingSkills(String missingSkills) {
		this.missingSkills = missingSkills;
	}

	public String getSavedAt() {
		return savedAt;
	}

	public void setSavedAt(String savedAt) {
		this.savedAt = savedAt;
	}
}