package com.resumematcher.resumematcher.service;


import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.resumematcher.resumematcher.model.Resume;
import com.resumematcher.resumematcher.repository.ResumeRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

    /**
     * Email regex — matches standard email formats found in resumes:
     * e.g.  ankita@gmail.com  |  john.doe+work@company.co.in
     */
    private static final Pattern EMAIL_PATTERN =
        Pattern.compile(
            "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
            Pattern.CASE_INSENSITIVE
        );

    /**
     * Save uploaded resume, extract text, auto-detect email from text.
     * @param email 
     */
    public Resume saveResume(MultipartFile file, String email) throws IOException {

        // 1. Create upload directory if needed
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

        // 2. Save file to disk
        String originalFileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(originalFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // 3. Extract text
        String extractedText = "";
        if (originalFileName != null && originalFileName.toLowerCase().endsWith(".pdf")) {
            extractedText = extractTextFromPDF(filePath.toFile());
        } else {
            extractedText = new String(file.getBytes());
        }

        // 4. ✅ Auto-detect email from extracted text using regex
        String candidateEmail = extractEmail(extractedText);

        // 5. Save to DB
        Resume resume = new Resume();
        resume.setFileName(originalFileName);
        resume.setFilePath(filePath.toString());
        resume.setExtractedText(extractedText);
        resume.setCandidateEmail(candidateEmail);   // auto-filled!
        resume.setUploadedAt(
            LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))
        );

        return resumeRepository.save(resume);
    }

    /**
     * Scan the resume text for the first email address found.
     * Returns empty string if no email found.
     */
    private String extractEmail(String text) {
        if (text == null || text.isBlank()) return "";
        Matcher m = EMAIL_PATTERN.matcher(text);
        if (m.find()) {
            return m.group().toLowerCase();
        }
        return "";
    }

    private String extractTextFromPDF(File pdfFile) {
        try (PDDocument document = PDDocument.load(pdfFile)) {
            return new PDFTextStripper().getText(document);
        } catch (IOException e) {
            System.err.println("Could not extract text from PDF: " + e.getMessage());
            return "";
        }
    }

    public Optional<Resume> findById(Long id) { return resumeRepository.findById(id); }
    public List<Resume> findAll()              { return resumeRepository.findAll(); }
}