package com.example.transitops.trip.entity;


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
import com.example.transitops.driver.entity.Driver;
import com.example.transitops.vehicle.entity.Vehicle;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

/*
 * Trip Entity
 *
 * Represents transport operations
 * between a source and destination.
 *
 * Status:
 * DRAFT
 * DISPATCHED
 * COMPLETED
 * CANCELLED
 */

@Entity
@Table(name = "trips")
@Getter
@Setter
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(name = "cargo_weight", nullable = false)
    private Double cargoWeight;

    @Column(name = "planned_distance", nullable = false)
    private Double plannedDistance;

    @Column(name = "actual_distance")
    private Double actualDistance;

    @Column(name = "fuel_consumed")
    private Double fuelConsumed;

    @Column
    private Double revenue;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TripStatus status = TripStatus.DRAFT;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;
}

