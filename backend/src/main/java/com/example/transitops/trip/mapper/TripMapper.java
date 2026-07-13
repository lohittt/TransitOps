package com.example.transitops.trip.mapper;

import com.example.transitops.trip.dto.TripRequest;
import com.example.transitops.trip.dto.TripResponse;
import com.example.transitops.trip.entity.Trip;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TripMapper {

    @Mapping(target = "vehicleId", source = "vehicle.id")
    @Mapping(target = "vehicleName", source = "vehicle.vehicleName")
    @Mapping(target = "driverId", source = "driver.id")
    @Mapping(target = "driverName", source = "driver.name")
    TripResponse toResponse(Trip trip);

    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "driver", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "startTime", ignore = true)
    @Mapping(target = "endTime", ignore = true)
    @Mapping(target = "actualDistance", ignore = true)
    @Mapping(target = "fuelConsumed", ignore = true)
    @Mapping(target = "revenue", ignore = true)
    @Mapping(target = "id", ignore = true)
    Trip toEntity(TripRequest request);
}
