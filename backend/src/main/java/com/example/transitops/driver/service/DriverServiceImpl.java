package com.example.transitops.driver.service;


// Driver Management Module.
//
// Handles driver profiles, availability, and assignments.
//
// States:
//
// Available
// ↓
// On Trip
// ↓
// Off Duty
import com.example.transitops.common.enums.DriverStatus;
import com.example.transitops.common.exception.BusinessException;
import com.example.transitops.common.exception.DuplicateResourceException;
import com.example.transitops.common.exception.ResourceNotFoundException;
import com.example.transitops.driver.dto.DriverRequest;
import com.example.transitops.driver.dto.DriverResponse;
import com.example.transitops.driver.entity.Driver;
import com.example.transitops.driver.mapper.DriverMapper;
import com.example.transitops.driver.repository.DriverRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final DriverMapper driverMapper;

    public DriverServiceImpl(DriverRepository driverRepository, DriverMapper driverMapper) {
        this.driverRepository = driverRepository;
        this.driverMapper = driverMapper;
    }

    @Override
    public DriverResponse create(DriverRequest request) {
        if (driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new DuplicateResourceException(
                    "Driver with license number '" + request.getLicenseNumber() + "' already exists");
        }
        Driver driver = driverMapper.toEntity(request);
        driver.setStatus(DriverStatus.AVAILABLE);
        return driverMapper.toResponse(driverRepository.save(driver));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> findAll() {
        return driverRepository.findAll().stream()
                .map(driverMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponse findById(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        return driverMapper.toResponse(driver);
    }

    @Override
    public DriverResponse update(Long id, DriverRequest request) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));

        if (!driver.getLicenseNumber().equals(request.getLicenseNumber())
                && driverRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new DuplicateResourceException(
                    "Driver with license number '" + request.getLicenseNumber() + "' already exists");
        }

        driverMapper.updateEntity(request, driver);
        return driverMapper.toResponse(driverRepository.save(driver));
    }

    @Override
    public void delete(Long id) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + id));
        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new BusinessException("Cannot delete a driver that is currently ON_TRIP");
        }
        driverRepository.deleteById(id);
    }
}

