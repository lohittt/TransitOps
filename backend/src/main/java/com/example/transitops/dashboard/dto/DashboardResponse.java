package com.example.transitops.dashboard.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long totalVehicles;
    private long availableVehicles;
    private long vehiclesOnTrip;
    private long vehiclesInShop;
    private long retiredVehicles;

    private long totalDrivers;
    private long availableDrivers;
    private long driversOnTrip;

    private long totalTrips;
    private long activeTrips;       // DISPATCHED
    private long pendingTrips;      // DRAFT
    private long completedTrips;
    private long cancelledTrips;

    private double fleetUtilizationPercent; // (ON_TRIP / total) * 100
}
