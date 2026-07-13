package com.example.transitops.maintenance.controller;


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
import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.maintenance.dto.MaintenanceRequest;
import com.example.transitops.maintenance.dto.MaintenanceResponse;
import com.example.transitops.maintenance.service.MaintenanceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/maintenance")
@Tag(name = "Maintenance", description = "Vehicle maintenance workflow")
public class MaintenanceController {

    private final MaintenanceService maintenanceService;

    public MaintenanceController(MaintenanceService maintenanceService) {
        this.maintenanceService = maintenanceService;
    }

    @PostMapping
    @Operation(summary = "Open a maintenance record")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> create(@Valid @RequestBody MaintenanceRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Maintenance record created", maintenanceService.create(request)));
    }

    @GetMapping
    @Operation(summary = "Get all maintenance records")
    public ResponseEntity<ApiResponse<List<MaintenanceResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(maintenanceService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get maintenance record by ID")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(maintenanceService.findById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a maintenance record")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> update(@PathVariable Long id, @Valid @RequestBody MaintenanceRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Maintenance record updated", maintenanceService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a maintenance record")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        maintenanceService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Maintenance record deleted", null));
    }

    @PutMapping("/{id}/close")
    @Operation(summary = "Close a maintenance record (ACTIVE → COMPLETED)")
    public ResponseEntity<ApiResponse<MaintenanceResponse>> close(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Maintenance record closed", maintenanceService.close(id)));
    }
}

