package com.example.transitops.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleROIResponse {

    private Long vehicleId;
    private String vehicleName;
    private String registrationNumber;
    private Double acquisitionCost;
    private Double totalRevenue;
    private Double totalOperationalCost;
    private Double totalDistanceKm;
    private long completedTrips;
    private Double costPerKm;
    private Double roiScore;                // (Revenue - (Maintenance + Fuel)) / Acquisition Cost
}
