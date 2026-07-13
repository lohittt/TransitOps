package com.example.transitops.notification.scheduler;

import com.example.transitops.common.enums.DriverStatus;
import com.example.transitops.driver.entity.Driver;
import com.example.transitops.driver.repository.DriverRepository;
import com.example.transitops.notification.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class LicenseExpiryScheduler {

    private static final Logger log = LoggerFactory.getLogger(LicenseExpiryScheduler.class);

    private final DriverRepository driverRepository;
    private final EmailService emailService;
    
    @Value("${transitops.scheduler.license-expiry.days:7}")
    private int reminderDays;

    public LicenseExpiryScheduler(DriverRepository driverRepository, EmailService emailService) {
        this.driverRepository = driverRepository;
        this.emailService = emailService;
    }

    // Runs every minute for testing purposes
    @Scheduled(cron = "0 * * * * ?")
    public void checkAndSendLicenseReminders() {
        log.info("Scheduler started: Checking for driver licenses expiring in the next {} days", reminderDays);
        
        LocalDate today = LocalDate.now();
        LocalDate targetDate = today.plusDays(reminderDays);
        
        // Fetch drivers whose expiry date is between today and targetDate. We skip SUSPENDED drivers.
        // If a driver's license has already expired (expiry < today), they are skipped.
        List<Driver> drivers = driverRepository.findByLicenseExpiryDateBetweenAndStatusNot(today, targetDate, DriverStatus.SUSPENDED);
        
        log.info("Found {} eligible drivers for license expiry reminders.", drivers.size());
        
        int sentCount = 0;
        
        for (Driver driver : drivers) {
            // Skip duplicate emails on the same day for the same driver (Requirement #10)
            if (today.equals(driver.getLastReminderSentDate())) {
                continue;
            }
            
            try {
                emailService.sendLicenseExpiryReminder(driver);
                driver.setLastReminderSentDate(today);
                driverRepository.save(driver);
                sentCount++;
            } catch (MailException e) {
                // Email sending exceptions are handled without stopping the scheduler (Requirement #14)
                log.error("Failed to process reminder for driver ID: {}. Scheduler continuing to next driver.", driver.getId());
            }
        }
        
        log.info("Scheduler finished: Successfully sent {} license expiry reminders.", sentCount);
    }
}
