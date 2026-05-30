package com.resumematcher.resumematcher.service;

import org.springframework.stereotype.Service;
import com.resumematcher.resumematcher.model.ContactMessage;
import com.resumematcher.resumematcher.repository.ContactRepository;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    public ContactMessage saveMessage(ContactMessage message) {
        return contactRepository.save(message);
    }
}