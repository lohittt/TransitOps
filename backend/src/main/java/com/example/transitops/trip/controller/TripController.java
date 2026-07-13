package com.example.transitops.trip.controller;


// Trip Management Module.
//
// This is the core workflow of TransitOps.
//
// Workflow:
//
// Draft
// ↓
// Dispatched
// ↓
// Completed
import com.example.transitops.common.response.ApiResponse;
import com.example.transitops.trip.dto.CompleteTripRequest;
import com.example.transitops.trip.dto.DispatchTripRequest;
import com.example.transitops.trip.dto.TripRequest;
import com.example.transitops.trip.dto.TripResponse;
import com.example.transitops.trip.service.TripService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/*
 * Trip API Gateway.
 *
 * This controller exposes endpoints for:
 * - Trip Creation
 * - Dispatch
 * - Completion
 * - Cancellation
 *
 * Complex workflow logic belongs in TripService.
 */

@RestController
@RequestMapping("/trips")
@Tag(name = "Trips", description = "Trip lifecycle management")
public class TripController {

    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @PostMapping
    @Operation(summary = "Create a new trip (DRAFT)")
    public ResponseEntity<ApiResponse<TripResponse>> create(@Valid @RequestBody TripRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Trip created successfully", tripService.create(request)));
    }

    @GetMapping
    @Operation(summary = "Get all trips")
    public ResponseEntity<ApiResponse<List<TripResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.success(tripService.findAll()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get trip by ID")
    public ResponseEntity<ApiResponse<TripResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(tripService.findById(id)));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update a DRAFT trip")
    public ResponseEntity<ApiResponse<TripResponse>> update(@PathVariable Long id, @Valid @RequestBody TripRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Trip updated successfully", tripService.update(id, request)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a trip")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        tripService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Trip deleted successfully", null));
    }

    @PutMapping("/{id}/dispatch")
    @Operation(summary = "Dispatch a trip (DRAFT → DISPATCHED)")
    public ResponseEntity<ApiResponse<TripResponse>> dispatch(@PathVariable Long id, @RequestBody(required = false) DispatchTripRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Trip dispatched", tripService.dispatch(id, request != null ? request : new DispatchTripRequest())));
    }

    @PutMapping("/{id}/complete")
    @Operation(summary = "Complete a dispatched trip (DISPATCHED → COMPLETED)")
    public ResponseEntity<ApiResponse<TripResponse>> complete(@PathVariable Long id, @Valid @RequestBody CompleteTripRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Trip completed", tripService.complete(id, request)));
    }

    @PutMapping("/{id}/cancel")
    @Operation(summary = "Cancel a trip")
    public ResponseEntity<ApiResponse<TripResponse>> cancel(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Trip cancelled", tripService.cancel(id)));
    }
}

