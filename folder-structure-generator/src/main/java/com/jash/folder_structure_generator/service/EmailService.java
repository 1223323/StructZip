package com.jash.folder_structure_generator.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;

    @Autowired
    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to StructZip, " + username + "!");
            message.setText("Hello " + username + ",\n\n" +
                    "Thank you for registering with StructZip, the AI-Powered File Structure Generator.\n" +
                    "We're excited to have you onboard!\n\n" +
                    "Happy coding!\n" +
                    "The StructZip Team");
            mailSender.send(message);
            logger.info("Welcome email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendLoginNotification(String toEmail, String username) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Login Notification for your StructZip account");
            message.setText("Hello " + username + ",\n\n" +
                    "This is a notification that your StructZip account was just accessed.\n" +
                    "If this was not you, please secure your account immediately.\n\n" +
                    "Best regards,\n" +
                    "The StructZip Team");
            mailSender.send(message);
            logger.info("Login notification email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send login notification email to {}: {}", toEmail, e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String toEmail, String username, String resetToken) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request - StructZip");
            message.setText("Hello " + username + ",\n\n" +
                    "We received a request to reset your password for your StructZip account.\n" +
                    "If you made this request, please use the following reset code: " + resetToken + "\n\n" +
                    "If you did not request a password reset, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "The StructZip Team");
            mailSender.send(message);
            logger.info("Password reset email sent successfully to {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to {}: {}", toEmail, e.getMessage());
        }
    }
}
