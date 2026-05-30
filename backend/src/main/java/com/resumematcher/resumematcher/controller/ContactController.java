package com.resumematcher.resumematcher.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.resumematcher.resumematcher.model.ContactMessage;
import com.resumematcher.resumematcher.service.ContactService;

@RestController
@RequestMapping("/contact")
@CrossOrigin(origins = "http://localhost:5173")
public class ContactController {

    private final ContactService contactService;

    // Constructor Injection (Spring will inject automatically)
    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody ContactMessage message) {
        ContactMessage saved = contactService.saveMessage(message);
        return ResponseEntity.ok(saved);
    }
}