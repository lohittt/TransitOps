package com.example.transitops.reports.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationalCostResponse {

    private Long vehicleId;
    private String vehicleName;
    private String registrationNumber;
    private Double totalFuelCost;
    private Double totalExpenses;
    private Double totalMaintenanceCost;
    private Double totalOperationalCost;    // fuel + expenses + maintenance
}
