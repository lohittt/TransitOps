package com.example.transitops.driver.entity;


// Driver Management Module.
//
// Handles driver profiles, availability, and assignments.
//
// States:
//
// Available
// ↓
// On Trip
// ↓
// Off Duty
import com.example.transitops.common.enums.DriverStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "drivers")
@Getter
@Setter
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "license_number", nullable = false, unique = true)
    private String licenseNumber;

    @Column(name = "license_category", nullable = false)
    private String licenseCategory;

    @Column(name = "license_expiry_date", nullable = false)
    private LocalDate licenseExpiryDate;

    @Column(nullable = false)
    private String email;

    @Column(name = "last_reminder_sent_date")
    private LocalDate lastReminderSentDate;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "safety_score", nullable = false)
    private Double safetyScore = 5.0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriverStatus status = DriverStatus.AVAILABLE;
}

