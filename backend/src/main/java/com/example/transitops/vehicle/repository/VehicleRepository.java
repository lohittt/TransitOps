package com.example.transitops.vehicle.repository;


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
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.enums.VehicleType;
import com.example.transitops.vehicle.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/*
 * Repository for Vehicle persistence.
 *
 * Custom queries should be limited to
 * filtering and searching operations.
 */

@Repository
public interface VehicleRepository extends JpaRepository<Vehicle, Long>, JpaSpecificationExecutor<Vehicle> {
    Optional<Vehicle> findByRegistrationNumber(String registrationNumber);
    boolean existsByRegistrationNumber(String registrationNumber);
    List<Vehicle> findByStatus(VehicleStatus status);
    long countByStatus(VehicleStatus status);
    List<Vehicle> findByVehicleType(VehicleType vehicleType);
    long countByVehicleType(VehicleType vehicleType);
    List<Vehicle> findByRegion(String region);
    long countByRegion(String region);
    List<Vehicle> findByVehicleTypeAndStatusAndRegion(VehicleType vehicleType, VehicleStatus status, String region);
    List<Vehicle> findByVehicleTypeAndStatus(VehicleType vehicleType, VehicleStatus status);
    List<Vehicle> findByVehicleTypeAndRegion(VehicleType vehicleType, String region);
    List<Vehicle> findByStatusAndRegion(VehicleStatus status, String region);
}

