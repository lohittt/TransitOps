package com.example.transitops.finance.mapper;

import com.example.transitops.finance.dto.ExpenseRequest;
import com.example.transitops.finance.dto.ExpenseResponse;
import com.example.transitops.finance.entity.Expense;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {

    @Mapping(target = "vehicleId", source = "vehicle.id")
    @Mapping(target = "vehicleName", source = "vehicle.vehicleName")
    @Mapping(target = "tripId", source = "trip.id")
    ExpenseResponse toResponse(Expense expense);

    @Mapping(target = "vehicle", ignore = true)
    @Mapping(target = "trip", ignore = true)
    Expense toEntity(ExpenseRequest request);
}
