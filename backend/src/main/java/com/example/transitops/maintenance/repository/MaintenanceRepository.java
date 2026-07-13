package com.example.transitops.maintenance.repository;


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
import com.example.transitops.maintenance.entity.MaintenanceLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MaintenanceRepository extends JpaRepository<MaintenanceLog, Long>, JpaSpecificationExecutor<MaintenanceLog> {
    List<MaintenanceLog> findByVehicleId(Long vehicleId);
    long countByStatus(MaintenanceStatus status);
    List<MaintenanceLog> findByStatus(MaintenanceStatus status);
}

