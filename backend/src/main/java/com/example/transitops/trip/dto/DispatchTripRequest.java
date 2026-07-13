package com.example.transitops.trip.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DispatchTripRequest {
    // Vehicle and driver are set during trip creation (DRAFT).
    // This request intentionally left with no additional fields unless overrides are needed.
    // Status will transition from DRAFT -> DISPATCHED.
}
