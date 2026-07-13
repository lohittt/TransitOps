package com.example.transitops.notification.service;

import com.example.transitops.driver.entity.Driver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);
    private final JavaMailSender mailSender;
    
    @org.springframework.beans.factory.annotation.Value("${spring.mail.username}")
    private String fromEmail;

    public EmailServiceImpl(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @Override
    public void sendLicenseExpiryReminder(Driver driver) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(driver.getEmail());
            helper.setSubject("Action Required: Upcoming License Renewal");
            
            String htmlBody = String.format(
                "<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;\">" +
                "  <h2 style=\"color: #2c3e50;\">TransitOps Driver Notification</h2>" +
                "  <p>Hello <strong>%s</strong>,</p>" +
                "  <p>We are writing to kindly remind you that your commercial driving license is scheduled to expire on <strong>%s</strong>.</p>" +
                "  <p>Please ensure you complete your renewal process prior to this date to maintain your active status on the platform.</p>" +
                "  <br>" +
                "  <p>Best regards,<br>The TransitOps Fleet Management Team</p>" +
                "  <hr style=\"border: none; border-top: 1px solid #eee; margin-top: 30px;\">" +
                "  <p style=\"font-size: 11px; color: #999; text-align: center;\">" +
                "    This is an automated message from TransitOps.<br>" +
                "    If you believe this is an error, please contact your dispatcher.<br>" +
                "    You are receiving this because you are an active driver on the TransitOps platform." +
                "  </p>" +
                "</div>",
                driver.getName(), driver.getLicenseExpiryDate().toString()
            );
            
            helper.setText(htmlBody, true); // Set to true for HTML
            mailSender.send(message);
            
            log.info("HTML Email sent successfully to driver: {} ({})", driver.getName(), driver.getEmail());
        } catch (MailException | MessagingException e) {
            log.error("Email sending failed for driver: {} ({}) - Error: {}", driver.getName(), driver.getEmail(), e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
