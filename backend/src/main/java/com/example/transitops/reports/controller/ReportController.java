package com.example.transitops.reports.controller;


// Analytics & Reporting Module.
//
// Aggregates data across modules to provide actionable insights.
// 
// Key Metrics: Fleet Utilization, Fuel Efficiency, Operational Costs, ROI.
import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.reports.dto.*;
import com.example.transitops.reports.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.example.transitops.reports.service.PdfExportService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/reports")
@Tag(name = "Reports", description = "Fleet analytics and reporting")
public class ReportController {

    private final ReportService reportService;
    private final PdfExportService pdfExportService;

    public ReportController(ReportService reportService, PdfExportService pdfExportService) {
        this.reportService = reportService;
        this.pdfExportService = pdfExportService;
    }

    @GetMapping("/export/pdf")
    @Operation(summary = "Export fleet report as PDF")
    public ResponseEntity<byte[]> exportPdf() {
        byte[] pdfBytes = pdfExportService.generateFleetReportPdf();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=fleet_report.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/fuel-efficiency")
    @Operation(summary = "Fuel efficiency report per vehicle (km/litre)")
    public ResponseEntity<ApiResponse<List<FuelEfficiencyResponse>>> getFuelEfficiency() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getFuelEfficiency()));
    }

    @GetMapping("/fleet-utilization")
    @Operation(summary = "Fleet utilization summary")
    public ResponseEntity<ApiResponse<FleetUtilizationResponse>> getFleetUtilization() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getFleetUtilization()));
    }

    @GetMapping("/operational-cost")
    @Operation(summary = "Operational cost breakdown per vehicle")
    public ResponseEntity<ApiResponse<List<OperationalCostResponse>>> getOperationalCost() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getOperationalCost()));
    }

    @GetMapping("/vehicle-roi")
    @Operation(summary = "Vehicle ROI score and cost per km")
    public ResponseEntity<ApiResponse<List<VehicleROIResponse>>> getVehicleROI() {
        return ResponseEntity.ok(ApiResponse.success(reportService.getVehicleROI()));
    }

    @GetMapping("/export/csv")
    @Operation(summary = "Export fleet report as CSV")
    public ResponseEntity<ApiResponse<CsvExportResponse>> exportCsv() {
        return ResponseEntity.ok(ApiResponse.success(reportService.exportCsv()));
    }
}

