package com.example.transitops.vehicle.service;


// Vehicle Management Module.
//
// Responsible for tracking and managing the fleet.
//
// Lifecycle:
//
// Active
// ↓
// In Maintenance
// ↓
// Retired
import com.example.transitops.common.exception.BusinessException;
import com.example.transitops.common.exception.DuplicateResourceException;
import com.example.transitops.common.exception.ResourceNotFoundException;
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.enums.VehicleType;
import com.example.transitops.common.specification.BaseSpecification;
import com.example.transitops.vehicle.dto.VehicleRequest;
import com.example.transitops.vehicle.dto.VehicleResponse;
import com.example.transitops.vehicle.entity.Vehicle;
import com.example.transitops.vehicle.mapper.VehicleMapper;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    /*
 * Registers a new vehicle.
 *
 * Business Rules:
 * - Registration Number must be unique.
 * - Initial Status = AVAILABLE.
 */
    @Override
    @Transactional(readOnly = true)
    public Page<VehicleResponse> searchVehicles(String keyword, VehicleStatus status, VehicleType type, String region, Pageable pageable) {
        Specification<Vehicle> spec = Specification.where(BaseSpecification.<Vehicle>searchByKeyword(keyword, "vehicleName", "registrationNumber"))
                .and(BaseSpecification.filterByEnum("status", status))
                .and(BaseSpecification.filterByEnum("vehicleType", type))
                .and(BaseSpecification.filterByExactMatch("region", region));
                
        return vehicleRepository.findAll(spec, pageable).map(vehicleMapper::toResponse);
    }

    @Override
    public VehicleResponse create(VehicleRequest request) {
        if (vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new DuplicateResourceException(
                    "Vehicle with registration number '" + request.getRegistrationNumber() + "' already exists");
        }
        Vehicle vehicle = vehicleMapper.toEntity(request);
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    /*
 * Internal status transition.
 *
 * This method should only be called by
 * Trip or Maintenance services.
 *
 * Avoid exposing this endpoint directly.
 */
    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> findAll() {
        return vehicleRepository.findAll().stream()
                .map(vehicleMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse findById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    public VehicleResponse update(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (!vehicle.getRegistrationNumber().equals(request.getRegistrationNumber())
                && vehicleRepository.existsByRegistrationNumber(request.getRegistrationNumber())) {
            throw new DuplicateResourceException(
                    "Vehicle with registration number '" + request.getRegistrationNumber() + "' already exists");
        }

        vehicleMapper.updateEntity(request, vehicle);
        return vehicleMapper.toResponse(vehicleRepository.save(vehicle));
    }

    @Override
    public void delete(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessException("Cannot delete a vehicle that is currently ON_TRIP");
        }
        vehicleRepository.deleteById(id);
    }
}

