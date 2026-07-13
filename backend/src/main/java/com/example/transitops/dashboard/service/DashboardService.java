package com.example.transitops.dashboard.service;


// Analytics & Reporting Module.
//
// Aggregates data across modules to provide actionable insights.
// 
// Key Metrics: Fleet Utilization, Fuel Efficiency, Operational Costs, ROI.
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.enums.VehicleType;
import com.example.transitops.dashboard.dto.DashboardResponse;

public interface DashboardService {
    DashboardResponse getDashboard(VehicleType vehicleType, VehicleStatus status, String region);
}

