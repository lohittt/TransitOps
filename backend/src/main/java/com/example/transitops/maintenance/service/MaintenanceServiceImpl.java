package com.example.transitops.maintenance.service;


// Vehicle Maintenance Module.
//
// Schedules and tracks repairs and routine servicing.
//
// Workflow:
//
// Scheduled
// ↓
// In Progress
// ↓
// Completed
import com.example.transitops.common.enums.MaintenanceStatus;
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.exception.BusinessException;
import com.example.transitops.common.exception.ResourceNotFoundException;
import com.example.transitops.maintenance.dto.MaintenanceRequest;
import com.example.transitops.maintenance.dto.MaintenanceResponse;
import com.example.transitops.maintenance.entity.MaintenanceLog;
import com.example.transitops.maintenance.mapper.MaintenanceMapper;
import com.example.transitops.maintenance.repository.MaintenanceRepository;
import com.example.transitops.vehicle.entity.Vehicle;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository maintenanceRepository;
    private final VehicleRepository vehicleRepository;
    private final MaintenanceMapper maintenanceMapper;

    public MaintenanceServiceImpl(MaintenanceRepository maintenanceRepository,
                                  VehicleRepository vehicleRepository,
                                  MaintenanceMapper maintenanceMapper) {
        this.maintenanceRepository = maintenanceRepository;
        this.vehicleRepository = vehicleRepository;
        this.maintenanceMapper = maintenanceMapper;
    }

    @Override
    public MaintenanceResponse create(MaintenanceRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessException("Cannot schedule maintenance for a vehicle that is currently ON_TRIP");
        }
        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new BusinessException("Cannot schedule maintenance for a RETIRED vehicle");
        }

        MaintenanceLog log = maintenanceMapper.toEntity(request);
        log.setVehicle(vehicle);
        log.setStatus(MaintenanceStatus.ACTIVE);

        // PDF Rule: Creating an active maintenance record automatically changes vehicle status to In Shop
        vehicle.setStatus(VehicleStatus.IN_SHOP);
        vehicleRepository.save(vehicle);

        return maintenanceMapper.toResponse(maintenanceRepository.save(log));
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaintenanceResponse> findAll() {
        return maintenanceRepository.findAll().stream()
                .map(maintenanceMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceResponse findById(Long id) {
        return maintenanceMapper.toResponse(getLog(id));
    }

    @Override
    public MaintenanceResponse update(Long id, MaintenanceRequest request) {
        MaintenanceLog log = getLog(id);
        if (log.getStatus() == MaintenanceStatus.COMPLETED) {
            throw new BusinessException("Cannot update a COMPLETED maintenance record");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        log.setVehicle(vehicle);
        log.setMaintenanceType(request.getMaintenanceType());
        log.setDescription(request.getDescription());
        log.setCost(request.getCost());
        log.setStartDate(request.getStartDate());
        return maintenanceMapper.toResponse(maintenanceRepository.save(log));
    }

    @Override
    public void delete(Long id) {
        MaintenanceLog log = getLog(id);
        if (log.getStatus() == MaintenanceStatus.ACTIVE) {
            // Restore vehicle status on delete
            Vehicle vehicle = log.getVehicle();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
        }
        maintenanceRepository.deleteById(id);
    }

    @Override
    public MaintenanceResponse close(Long id) {
        MaintenanceLog log = getLog(id);
        if (log.getStatus() == MaintenanceStatus.COMPLETED) {
            throw new BusinessException("Maintenance record is already COMPLETED");
        }

        // PDF Rule: Closing maintenance restores the vehicle to Available (unless retired)
        Vehicle vehicle = log.getVehicle();
        if (vehicle.getStatus() != VehicleStatus.RETIRED) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
        }

        log.setStatus(MaintenanceStatus.COMPLETED);
        log.setEndDate(LocalDate.now());
        return maintenanceMapper.toResponse(maintenanceRepository.save(log));
    }

    private MaintenanceLog getLog(Long id) {
        return maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance record not found with id: " + id));
    }
}

