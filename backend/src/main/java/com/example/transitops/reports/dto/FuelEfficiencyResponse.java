package com.example.transitops.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuelEfficiencyResponse {

    private Long vehicleId;
    private String vehicleName;
    private String registrationNumber;
    private Double totalLiters;
    private Double totalDistanceKm;
    private Double kmPerLiter;      // efficiency: km / litre
    private Double costPerKm;       // total fuel cost / total distance
}
