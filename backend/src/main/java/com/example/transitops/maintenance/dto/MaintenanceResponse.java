package com.example.transitops.maintenance.dto;

import com.example.transitops.common.enums.MaintenanceStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MaintenanceResponse {

    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private String maintenanceType;
    private String description;
    private Double cost;
    private MaintenanceStatus status;
    private LocalDate startDate;
    private LocalDate endDate;
}
