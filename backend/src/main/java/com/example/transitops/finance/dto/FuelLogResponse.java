package com.example.transitops.finance.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FuelLogResponse {

    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private Long tripId;
    private Double liters;
    private Double cost;
    private LocalDate date;
}
