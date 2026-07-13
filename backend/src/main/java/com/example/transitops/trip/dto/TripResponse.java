package com.example.transitops.trip.dto;

import com.example.transitops.common.enums.TripStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripResponse {

    private Long id;
    private String source;
    private String destination;
    private Double cargoWeight;
    private Double plannedDistance;
    private Double actualDistance;
    private Double fuelConsumed;
    private Double revenue;
    private TripStatus status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Long vehicleId;
    private String vehicleName;
    private Long driverId;
    private String driverName;
}
