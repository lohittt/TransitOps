package com.example.transitops.vehicle.dto;

import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.enums.VehicleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VehicleResponse {

    private Long id;
    private String registrationNumber;
    private String vehicleName;
    private VehicleType vehicleType;
    private Double maximumLoadCapacity;
    private Double odometer;
    private Double acquisitionCost;
    private String region;
    private VehicleStatus status;
}
