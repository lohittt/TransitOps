package com.example.transitops.vehicle.dto;

import com.example.transitops.common.enums.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VehicleRequest {

    @NotBlank(message = "Registration number is required")
    private String registrationNumber;

    @NotBlank(message = "Vehicle name is required")
    private String vehicleName;

    @NotNull(message = "Vehicle type is required")
    private VehicleType vehicleType;

    @NotNull(message = "Maximum load capacity is required")
    @Positive(message = "Load capacity must be positive")
    private Double maximumLoadCapacity;

    @NotNull(message = "Odometer reading is required")
    @Positive(message = "Odometer must be positive")
    private Double odometer;

    @NotNull(message = "Acquisition cost is required")
    @Positive(message = "Acquisition cost must be positive")
    private Double acquisitionCost;

    private String region;
}
