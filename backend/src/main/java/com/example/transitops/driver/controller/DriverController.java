package com.example.transitops.driver.controller;


// Driver Management Module.
//
// Handles driver profiles, availability, and assignments.
//
// States:
//
// Available
// ↓
// On Trip
// ↓
// Off Duty
import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.driver.dto.DriverRequest;
import com.example.transitops.driver.dto.DriverResponse;
import com.example.transitops.driver.service.DriverService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Driver REST API.
 *
 * Exposes CRUD operations for driver management.
 *
 * Security:
 * Accessible only to authorized roles.
 */

@RestController
@RequestMapping("/drivers")
@Tag(name = "Drivers", description = "Driver management")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @PostMapping
    @Operation(summary = "Add a new driver")
    public ResponseEntity<ApiResponse<DriverResponse>> create(@Valid @RequestBody DriverRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Driver created successfully", driverService.create(request)));
    }

    @GetMapping
    @Operation(summary = "Get all drivers")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(driverService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get driver by ID")
    public ResponseEntity<ApiResponse<DriverResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(driverService.findById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update driver")
    public ResponseEntity<ApiResponse<DriverResponse>> update(@PathVariable Long id, @Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Driver updated successfully", driverService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete driver")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        driverService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Driver deleted successfully", null));
    }
}

