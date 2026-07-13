package com.example.transitops.trip.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CompleteTripRequest {

    @NotNull(message = "Actual distance is required")
    @Positive(message = "Actual distance must be positive")
    private Double actualDistance;

    @NotNull(message = "Fuel consumed is required")
    @Positive(message = "Fuel consumed must be positive")
    private Double fuelConsumed;

    @Positive(message = "Revenue must be positive")
    private Double revenue;
}
