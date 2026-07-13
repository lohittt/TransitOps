package com.example.transitops.maintenance.mapper;

import com.example.transitops.maintenance.dto.MaintenanceRequest;
import com.example.transitops.maintenance.dto.MaintenanceResponse;
import com.example.transitops.maintenance.entity.MaintenanceLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MaintenanceMapper {

    @Mapping(target = "vehicleId", source = "vehicle.id")
    @Mapping(target = "vehicleName", source = "vehicle.vehicleName")
    MaintenanceResponse toResponse(MaintenanceLog log);

    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "endDate", ignore = true)
    MaintenanceLog toEntity(MaintenanceRequest request);
}
