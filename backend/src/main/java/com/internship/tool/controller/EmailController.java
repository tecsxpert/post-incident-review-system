package com.internship.tool.controller;

import com.internship.tool.service.EmailService;
import org.springframework.web.bind.annotation.*;

@RestController
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping("/send-email")
    public String sendEmail(@RequestParam String to) {

        emailService.sendEmail(
                to,
                "Incident Notification",
                "Incident Created Successfully"
        );

        return "Email Sent Successfully";
    }
}