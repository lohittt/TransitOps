package com.example.transitops.reports.controller;

import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.reports.dto.ChartDataResponse;
import com.example.transitops.reports.dto.FuelEfficiencyResponse;
import com.example.transitops.reports.dto.OperationalCostResponse;
import com.example.transitops.reports.dto.VehicleROIResponse;
import com.example.transitops.reports.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/charts")
@Tag(name = "Charts & Analytics", description = "Formatted JSON data for frontend chart libraries")
public class ChartController {

    private final ReportService reportService;

    public ChartController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/fuel-efficiency")
    @Operation(summary = "Get fuel efficiency data formatted for charts")
    public ResponseEntity<ApiResponse<ChartDataResponse>> getFuelEfficiencyChart() {
        List<FuelEfficiencyResponse> data = reportService.getFuelEfficiency();
        
        List<String> labels = data.stream().map(FuelEfficiencyResponse::getVehicleName).collect(Collectors.toList());
        List<Double> values = data.stream().map(FuelEfficiencyResponse::getKmPerLiter).collect(Collectors.toList());
        
        ChartDataResponse.Dataset dataset = ChartDataResponse.Dataset.builder()
                .label("Fuel Efficiency (km/L)")
                .data(values)
                .backgroundColor("rgba(54, 162, 235, 0.6)")
                .borderColor("rgba(54, 162, 235, 1)")
                .build();
                
        return ResponseEntity.ok(ApiResponse.success(new ChartDataResponse(labels, List.of(dataset))));
    }

    @GetMapping("/operational-cost")
    @Operation(summary = "Get operational cost data formatted for charts")
    public ResponseEntity<ApiResponse<ChartDataResponse>> getOperationalCostChart() {
        List<OperationalCostResponse> data = reportService.getOperationalCost();
        
        List<String> labels = data.stream().map(OperationalCostResponse::getVehicleName).collect(Collectors.toList());
        List<Double> values = data.stream().map(OperationalCostResponse::getTotalOperationalCost).collect(Collectors.toList());
        
        ChartDataResponse.Dataset dataset = ChartDataResponse.Dataset.builder()
                .label("Operational Cost ($)")
                .data(values)
                .backgroundColor("rgba(255, 99, 132, 0.6)")
                .borderColor("rgba(255, 99, 132, 1)")
                .build();
                
        return ResponseEntity.ok(ApiResponse.success(new ChartDataResponse(labels, List.of(dataset))));
    }

    @GetMapping("/vehicle-roi")
    @Operation(summary = "Get vehicle ROI data formatted for charts")
    public ResponseEntity<ApiResponse<ChartDataResponse>> getVehicleROIChart() {
        List<VehicleROIResponse> data = reportService.getVehicleROI();
        
        List<String> labels = data.stream().map(VehicleROIResponse::getVehicleName).collect(Collectors.toList());
        List<Double> values = data.stream().map(VehicleROIResponse::getRoiScore).collect(Collectors.toList());
        
        ChartDataResponse.Dataset dataset = ChartDataResponse.Dataset.builder()
                .label("Vehicle ROI (%)")
                .data(values)
                .backgroundColor("rgba(75, 192, 192, 0.6)")
                .borderColor("rgba(75, 192, 192, 1)")
                .build();
                
        return ResponseEntity.ok(ApiResponse.success(new ChartDataResponse(labels, List.of(dataset))));
    }
}
