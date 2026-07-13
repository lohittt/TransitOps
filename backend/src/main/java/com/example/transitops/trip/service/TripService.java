package com.example.transitops.trip.service;


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
import com.example.transitops.trip.dto.CompleteTripRequest;
import com.example.transitops.trip.dto.DispatchTripRequest;
import com.example.transitops.trip.dto.TripRequest;
import com.example.transitops.trip.dto.TripResponse;

import java.util.List;

/*
 * Service Contract.
 *
 * Provides transport workflow operations.
 *
 * All implementations must satisfy
 * mandatory business rules defined
 * in the project specification.
 */
public interface TripService {
    TripResponse create(TripRequest request);
    List<TripResponse> findAll();
    TripResponse findById(Long id);
    TripResponse update(Long id, TripRequest request);
    void delete(Long id);
    TripResponse dispatch(Long id, DispatchTripRequest request);
    TripResponse complete(Long id, CompleteTripRequest request);
    TripResponse cancel(Long id);
}

