package com.example.transitops.finance.mapper;

import com.example.transitops.finance.dto.FuelLogRequest;
import com.example.transitops.finance.dto.FuelLogResponse;
import com.example.transitops.finance.entity.FuelLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FuelLogMapper {

    @Mapping(target = "vehicleId", source = "vehicle.id")
    @Mapping(target = "vehicleName", source = "vehicle.vehicleName")
    @Mapping(target = "tripId", source = "trip.id")
    FuelLogResponse toResponse(FuelLog fuelLog);

    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "trip", ignore = true)
    FuelLog toEntity(FuelLogRequest request);
}
