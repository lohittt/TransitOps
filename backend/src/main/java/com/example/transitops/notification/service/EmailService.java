package com.example.transitops.notification.service;

import com.example.transitops.driver.entity.Driver;

public interface EmailService {
    void sendLicenseExpiryReminder(Driver driver);
}
