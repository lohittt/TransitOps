package com.example.transitops.driver.service;


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
import com.example.transitops.driver.dto.DriverRequest;
import com.example.transitops.driver.dto.DriverResponse;

import java.util.List;

public interface DriverService {
    DriverResponse create(DriverRequest request);
    List<DriverResponse> findAll();
    DriverResponse findById(Long id);
    DriverResponse update(Long id, DriverRequest request);
    void delete(Long id);
}

