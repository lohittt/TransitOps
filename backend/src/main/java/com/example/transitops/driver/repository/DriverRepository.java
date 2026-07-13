package com.example.transitops.driver.repository;


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
import com.example.transitops.driver.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Repository for Driver persistence.
 *
 * Avoid embedding business rules.
 * Repository should only interact with the database.
 */

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long>, JpaSpecificationExecutor<Driver> {
    boolean existsByLicenseNumber(String licenseNumber);
    List<Driver> findByStatus(DriverStatus status);
    long countByStatus(DriverStatus status);
    List<Driver> findByLicenseExpiryDateBetweenAndStatusNot(java.time.LocalDate start, java.time.LocalDate end, DriverStatus status);
}

