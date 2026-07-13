package com.example.transitops.vehicle.mapper;

import com.example.transitops.vehicle.dto.VehicleRequest;
import com.example.transitops.vehicle.dto.VehicleResponse;
import com.example.transitops.vehicle.entity.Vehicle;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

    VehicleResponse toResponse(Vehicle vehicle);

    Vehicle toEntity(VehicleRequest request);

    void updateEntity(VehicleRequest request, @MappingTarget Vehicle vehicle);
}
