package com.resumematcher.resumematcher.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "resumes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Original file name (e.g., "ankita_resume.pdf")
    private String fileName;

    // Path where file is stored on disk
    private String filePath;

    // Full extracted text from the resume
    @Column(columnDefinition = "TEXT")
    private String extractedText;

    // ✅ Email automatically extracted from resume text using regex
    private String candidateEmail;

    // When was this resume uploaded
    private String uploadedAt;

	public Resume(String fileName, String filePath, String extractedText, String candidateEmail, String uploadedAt) {
		super();
		this.fileName = fileName;
		this.filePath = filePath;
		this.extractedText = extractedText;
		this.candidateEmail = candidateEmail;
		this.uploadedAt = uploadedAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getExtractedText() {
		return extractedText;
	}

	public void setExtractedText(String extractedText) {
		this.extractedText = extractedText;
	}

	public String getCandidateEmail() {
		return candidateEmail;
	}

	public void setCandidateEmail(String candidateEmail) {
		this.candidateEmail = candidateEmail;
	}

	public String getUploadedAt() {
		return uploadedAt;
	}

	public void setUploadedAt(String uploadedAt) {
		this.uploadedAt = uploadedAt;
	}
    
}