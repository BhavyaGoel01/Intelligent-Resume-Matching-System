package com.resumematcher.resumematcher.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendSelectionEmail(String toEmail) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Selected for Next Round - SkillMatch");

        message.setText(
                "Dear Candidate,\n\n" +
                "Congratulations!\n\n" +
                "Based on our evaluation, your resume has been shortlisted for the next round.\n\n" +
                "Our HR team will contact you soon with further details.\n\n" +
                "Best Regards,\n" +
                "SkillMatch HR Team"
        );

        mailSender.send(message);
    }
}