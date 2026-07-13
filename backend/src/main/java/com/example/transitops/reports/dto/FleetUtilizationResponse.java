package com.example.transitops.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FleetUtilizationResponse {

    private long totalVehicles;
    private long availableVehicles;
    private long vehiclesOnTrip;
    private long vehiclesInShop;
    private long retiredVehicles;
    private double utilizationPercent;      // (ON_TRIP / total) * 100
    private long totalCompletedTrips;
    private double averageTripsPerVehicle;
}
