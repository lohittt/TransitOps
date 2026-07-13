package com.example.transitops.trip.service;


// Trip Management Module.
//
// This is the core workflow of TransitOps.
//
// Workflow:
//
// Draft
// ↓
// Dispatched
// ↓
// Completed
import com.example.transitops.common.enums.DriverStatus;
import com.example.transitops.common.enums.TripStatus;
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.exception.BusinessException;
import com.example.transitops.common.exception.ResourceNotFoundException;
import com.example.transitops.driver.entity.Driver;
import com.example.transitops.driver.repository.DriverRepository;
import com.example.transitops.trip.dto.CompleteTripRequest;
import com.example.transitops.trip.dto.DispatchTripRequest;
import com.example.transitops.trip.dto.TripRequest;
import com.example.transitops.trip.dto.TripResponse;
import com.example.transitops.trip.entity.Trip;
import com.example.transitops.trip.mapper.TripMapper;
import com.example.transitops.trip.repository.TripRepository;
import com.example.transitops.vehicle.entity.Vehicle;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TripServiceImpl implements TripService {

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripMapper tripMapper;

    public TripServiceImpl(TripRepository tripRepository,
                           VehicleRepository vehicleRepository,
                           DriverRepository driverRepository,
                           TripMapper tripMapper) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripMapper = tripMapper;
    }

    @Override
    public TripResponse create(TripRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + request.getDriverId()));

        // PDF Rule: Retired or In Shop vehicles must never appear in dispatch selection
        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new BusinessException("Cannot assign a RETIRED vehicle to a trip");
        }
        if (vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            throw new BusinessException("Cannot assign an IN_SHOP vehicle to a trip");
        }
        // PDF Rule: Drivers with Suspended status cannot be assigned to trips
        if (driver.getStatus() == DriverStatus.SUSPENDED) {
            throw new BusinessException("Cannot assign a SUSPENDED driver to a trip");
        }
        // PDF Rule: Drivers with expired licenses cannot be assigned to trips
        if (driver.getLicenseExpiryDate() != null && driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new BusinessException("Cannot assign a driver with an expired license to a trip");
        }
        // PDF Rule: A driver already marked On Trip cannot be assigned to another trip
        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            throw new BusinessException("Driver is already ON_TRIP and cannot be assigned to another trip");
        }
        // PDF Rule: A vehicle already marked On Trip cannot be assigned to another trip
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            throw new BusinessException("Vehicle is already ON_TRIP and cannot be assigned to another trip");
        }

        Trip trip = tripMapper.toEntity(request);
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setStatus(TripStatus.DRAFT);
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    @Transactional(readOnly = true)
    public List<TripResponse> findAll() {
        return tripRepository.findAll().stream()
                .map(tripMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse findById(Long id) {
        return tripMapper.toResponse(getTrip(id));
    }

    @Override
    public TripResponse update(Long id, TripRequest request) {
        Trip trip = getTrip(id);
        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessException("Only DRAFT trips can be updated");
        }

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));
        Driver driver = driverRepository.findById(request.getDriverId())
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + request.getDriverId()));

        trip.setSource(request.getSource());
        trip.setDestination(request.getDestination());
        trip.setCargoWeight(request.getCargoWeight());
        trip.setPlannedDistance(request.getPlannedDistance());
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    public void delete(Long id) {
        Trip trip = getTrip(id);
        if (trip.getStatus() == TripStatus.DISPATCHED) {
            throw new BusinessException("Cannot delete a DISPATCHED trip");
        }
        tripRepository.deleteById(id);
    }

    @Override
    public TripResponse dispatch(Long id, DispatchTripRequest request) {
        Trip trip = getTrip(id);
        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessException("Only DRAFT trips can be dispatched");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        if (vehicle.getStatus() != VehicleStatus.AVAILABLE) {
            throw new BusinessException("Vehicle is not AVAILABLE for dispatch. Current status: " + vehicle.getStatus());
        }
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new BusinessException("Driver is not AVAILABLE for dispatch. Current status: " + driver.getStatus());
        }
        // PDF Rule: Drivers with expired licenses cannot be assigned to trips
        if (driver.getLicenseExpiryDate() != null && driver.getLicenseExpiryDate().isBefore(LocalDate.now())) {
            throw new BusinessException("Cannot dispatch: driver's license has expired");
        }
        if (vehicle.getMaximumLoadCapacity() < trip.getCargoWeight()) {
            throw new BusinessException("Cargo weight exceeds vehicle maximum load capacity");
        }

        // PDF Rule: Dispatching automatically changes both to On Trip
        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setStatus(TripStatus.DISPATCHED);
        trip.setStartTime(LocalDateTime.now());
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    public TripResponse complete(Long id, CompleteTripRequest request) {
        Trip trip = getTrip(id);
        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessException("Only DISPATCHED trips can be completed");
        }

        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        // PDF Rule: Completing a trip automatically changes both back to Available
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        vehicle.setOdometer(vehicle.getOdometer() + request.getActualDistance());
        driver.setStatus(DriverStatus.AVAILABLE);
        vehicleRepository.save(vehicle);
        driverRepository.save(driver);

        trip.setStatus(TripStatus.COMPLETED);
        trip.setEndTime(LocalDateTime.now());
        trip.setActualDistance(request.getActualDistance());
        trip.setFuelConsumed(request.getFuelConsumed());
        trip.setRevenue(request.getRevenue());
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    @Override
    public TripResponse cancel(Long id) {
        Trip trip = getTrip(id);
        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new BusinessException("Trip is already " + trip.getStatus());
        }

        // PDF Rule: Cancelling a dispatched trip restores vehicle and driver to Available
        if (trip.getStatus() == TripStatus.DISPATCHED) {
            Vehicle vehicle = trip.getVehicle();
            Driver driver = trip.getDriver();
            vehicle.setStatus(VehicleStatus.AVAILABLE);
            driver.setStatus(DriverStatus.AVAILABLE);
            vehicleRepository.save(vehicle);
            driverRepository.save(driver);
        }

        trip.setStatus(TripStatus.CANCELLED);
        trip.setEndTime(LocalDateTime.now());
        return tripMapper.toResponse(tripRepository.save(trip));
    }

    private Trip getTrip(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + id));
    }
}

