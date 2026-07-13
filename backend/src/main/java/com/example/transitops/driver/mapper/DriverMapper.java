package com.example.transitops.driver.mapper;

import com.example.transitops.driver.dto.DriverRequest;
import com.example.transitops.driver.dto.DriverResponse;
import com.example.transitops.driver.entity.Driver;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DriverMapper {

    DriverResponse toResponse(Driver driver);

    Driver toEntity(DriverRequest request);

    void updateEntity(DriverRequest request, @MappingTarget Driver driver);
}
