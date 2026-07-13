package com.example.transitops.reports.service;


// Analytics & Reporting Module.
//
// Aggregates data across modules to provide actionable insights.
// 
// Key Metrics: Fleet Utilization, Fuel Efficiency, Operational Costs, ROI.
import com.example.transitops.reports.dto.*;

import java.util.List;

public interface ReportService {
    List<FuelEfficiencyResponse> getFuelEfficiency();
    FleetUtilizationResponse getFleetUtilization();
    List<OperationalCostResponse> getOperationalCost();
    List<VehicleROIResponse> getVehicleROI();
    CsvExportResponse exportCsv();
}

