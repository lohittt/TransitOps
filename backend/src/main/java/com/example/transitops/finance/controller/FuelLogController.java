package com.example.transitops.finance.controller;


// Finance & Fuel Management Module.
//
// Tracks operational expenses and fuel consumption.
//
// Flow:
//
// Log Entry
// ↓
// Verification
// ↓
// Financial Reporting
import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.finance.dto.FuelLogRequest;
import com.example.transitops.finance.dto.FuelLogResponse;
import com.example.transitops.finance.service.FuelLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/fuel-logs")
@Tag(name = "Fuel Logs", description = "Fuel consumption tracking")
public class FuelLogController {

    private final FuelLogService fuelLogService;

    public FuelLogController(FuelLogService fuelLogService) {
        this.fuelLogService = fuelLogService;
    }

    @PostMapping
    @Operation(summary = "Record a fuel log")
    public ResponseEntity<ApiResponse<FuelLogResponse>> create(@Valid @RequestBody FuelLogRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Fuel log created", fuelLogService.create(request)));
    }

    @GetMapping
    @Operation(summary = "Get all fuel logs")
    public ResponseEntity<ApiResponse<List<FuelLogResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(fuelLogService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get fuel log by ID")
    public ResponseEntity<ApiResponse<FuelLogResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(fuelLogService.findById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a fuel log")
    public ResponseEntity<ApiResponse<FuelLogResponse>> update(@PathVariable Long id, @Valid @RequestBody FuelLogRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Fuel log updated", fuelLogService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a fuel log")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        fuelLogService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Fuel log deleted", null));
    }
}

