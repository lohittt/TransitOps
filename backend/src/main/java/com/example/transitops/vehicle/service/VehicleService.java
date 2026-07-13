package com.example.transitops.vehicle.service;


// Vehicle Management Module.
//
// Responsible for tracking and managing the fleet.
//
// Lifecycle:
//
// Active
// ↓
// In Maintenance
// ↓
// Retired
import com.example.transitops.vehicle.dto.VehicleRequest;
import com.example.transitops.vehicle.dto.VehicleResponse;
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.enums.VehicleType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface VehicleService {
    VehicleResponse create(VehicleRequest request);
    VehicleResponse findById(Long id);
    List<VehicleResponse> findAll();
    Page<VehicleResponse> searchVehicles(String keyword, VehicleStatus status, VehicleType type, String region, Pageable pageable);
    VehicleResponse update(Long id, VehicleRequest request);
    void delete(Long id);
}

