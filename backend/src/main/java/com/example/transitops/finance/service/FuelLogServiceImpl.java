package com.example.transitops.finance.service;


// Finance & Fuel Management Module.
//
// Tracks operational expenses and fuel consumption.
//
// Flow:
//
// Log Entry
// ↓
// Verification
// ↓
// Financial Reporting
import com.example.transitops.common.exception.ResourceNotFoundException;
import com.example.transitops.finance.dto.FuelLogRequest;
import com.example.transitops.finance.dto.FuelLogResponse;
import com.example.transitops.finance.entity.FuelLog;
import com.example.transitops.finance.mapper.FuelLogMapper;
import com.example.transitops.finance.repository.FuelLogRepository;
import com.example.transitops.trip.entity.Trip;
import com.example.transitops.trip.repository.TripRepository;
import com.example.transitops.vehicle.entity.Vehicle;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FuelLogServiceImpl implements FuelLogService {

    private final FuelLogRepository fuelLogRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final FuelLogMapper fuelLogMapper;

    public FuelLogServiceImpl(FuelLogRepository fuelLogRepository, VehicleRepository vehicleRepository,
                              TripRepository tripRepository, FuelLogMapper fuelLogMapper) {
        this.fuelLogRepository = fuelLogRepository;
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
        this.fuelLogMapper = fuelLogMapper;
    }

    @Override
    public FuelLogResponse create(FuelLogRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        FuelLog fuelLog = fuelLogMapper.toEntity(request);
        fuelLog.setVehicle(vehicle);

        if (request.getTripId() != null) {
            Trip trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.getTripId()));
            fuelLog.setTrip(trip);
        }

        return fuelLogMapper.toResponse(fuelLogRepository.save(fuelLog));
    }

    @Override
    @Transactional(readOnly = true)
    public List<FuelLogResponse> findAll() {
        return fuelLogRepository.findAll().stream()
                .map(fuelLogMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public FuelLogResponse findById(Long id) {
        return fuelLogMapper.toResponse(getLog(id));
    }

    @Override
    public FuelLogResponse update(Long id, FuelLogRequest request) {
        FuelLog fuelLog = getLog(id);
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        fuelLog.setVehicle(vehicle);
        fuelLog.setLiters(request.getLiters());
        fuelLog.setCost(request.getCost());
        fuelLog.setDate(request.getDate());

        if (request.getTripId() != null) {
            Trip trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.getTripId()));
            fuelLog.setTrip(trip);
        } else {
            fuelLog.setTrip(null);
        }

        return fuelLogMapper.toResponse(fuelLogRepository.save(fuelLog));
    }

    @Override
    public void delete(Long id) {
        if (!fuelLogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Fuel log not found with id: " + id);
        }
        fuelLogRepository.deleteById(id);
    }

    private FuelLog getLog(Long id) {
        return fuelLogRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fuel log not found with id: " + id));
    }
}

