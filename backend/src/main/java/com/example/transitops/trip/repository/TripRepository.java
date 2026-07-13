package com.example.transitops.trip.repository;


// Trip Management Module.
//
// This is the core workflow of TransitOps.
//
// Workflow:
//
// Draft
// ↓
// Dispatched
// ↓
// Completed
import com.example.transitops.common.enums.TripStatus;
import com.example.transitops.trip.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

/*
 * Repository for Trip persistence.
 *
 * Keep only database access here.
 * Business logic belongs in TripService.
 */
@Repository
public interface TripRepository extends JpaRepository<Trip, Long>, JpaSpecificationExecutor<Trip> {
    long countByStatus(TripStatus status);
    List<Trip> findByStatus(TripStatus status);
    List<Trip> findByVehicleId(Long vehicleId);
    List<Trip> findByDriverId(Long driverId);
}

