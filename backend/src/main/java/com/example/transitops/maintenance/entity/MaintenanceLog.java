package com.example.transitops.maintenance.entity;


// Vehicle Maintenance Module.
//
// Schedules and tracks repairs and routine servicing.
//
// Workflow:
//
// Scheduled
// ↓
// In Progress
// ↓
// Completed
import com.example.transitops.common.enums.MaintenanceStatus;
import com.example.transitops.vehicle.entity.Vehicle;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "maintenance_logs")
@Getter
@Setter
public class MaintenanceLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Column(name = "maintenance_type", nullable = false)
    private String maintenanceType;

    @Column(nullable = false, length = 1000)
    private String description;

    @Column(nullable = false)
    private Double cost;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaintenanceStatus status = MaintenanceStatus.ACTIVE;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;
}

