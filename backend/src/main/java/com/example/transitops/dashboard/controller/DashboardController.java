package com.example.transitops.dashboard.controller;


// Analytics & Reporting Module.
//
// Aggregates data across modules to provide actionable insights.
// 
// Key Metrics: Fleet Utilization, Fuel Efficiency, Operational Costs, ROI.
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.enums.VehicleType;
import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.dashboard.dto.DashboardResponse;
import com.example.transitops.dashboard.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@Tag(name = "Dashboard", description = "Fleet KPI summary")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    @Operation(summary = "Get fleet dashboard KPIs with optional filters")
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard(
            @Parameter(description = "Filter by vehicle type") @RequestParam(required = false) VehicleType vehicleType,
            @Parameter(description = "Filter by vehicle status") @RequestParam(required = false) VehicleStatus status,
            @Parameter(description = "Filter by region") @RequestParam(required = false) String region) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboard(vehicleType, status, region)));
    }
}

