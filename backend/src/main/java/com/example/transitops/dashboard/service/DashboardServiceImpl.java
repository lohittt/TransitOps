package com.example.transitops.dashboard.service;


// Analytics & Reporting Module.
//
// Aggregates data across modules to provide actionable insights.
// 
// Key Metrics: Fleet Utilization, Fuel Efficiency, Operational Costs, ROI.
import com.example.transitops.common.enums.DriverStatus;
import com.example.transitops.common.enums.TripStatus;
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.enums.VehicleType;
import com.example.transitops.dashboard.dto.DashboardResponse;
import com.example.transitops.driver.repository.DriverRepository;
import com.example.transitops.trip.repository.TripRepository;
import com.example.transitops.vehicle.entity.Vehicle;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class DashboardServiceImpl implements DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardServiceImpl(VehicleRepository vehicleRepository,
                                DriverRepository driverRepository,
                                TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    public DashboardResponse getDashboard(VehicleType vehicleType, VehicleStatus status, String region) {
        // Get filtered vehicle list based on optional parameters
        List<Vehicle> vehicles = vehicleRepository.findAll();

        if (vehicleType != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getVehicleType() == vehicleType)
                    .collect(Collectors.toList());
        }
        if (status != null) {
            vehicles = vehicles.stream()
                    .filter(v -> v.getStatus() == status)
                    .collect(Collectors.toList());
        }
        if (region != null && !region.isBlank()) {
            vehicles = vehicles.stream()
                    .filter(v -> region.equalsIgnoreCase(v.getRegion()))
                    .collect(Collectors.toList());
        }

        long totalVehicles      = vehicles.size();
        long availableVehicles  = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.AVAILABLE).count();
        long vehiclesOnTrip     = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.ON_TRIP).count();
        long vehiclesInShop     = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.IN_SHOP).count();
        long retiredVehicles    = vehicles.stream().filter(v -> v.getStatus() == VehicleStatus.RETIRED).count();

        long totalDrivers       = driverRepository.count();
        long availableDrivers   = driverRepository.countByStatus(DriverStatus.AVAILABLE);
        long driversOnTrip      = driverRepository.countByStatus(DriverStatus.ON_TRIP);

        long totalTrips         = tripRepository.count();
        long activeTrips        = tripRepository.countByStatus(TripStatus.DISPATCHED);
        long pendingTrips       = tripRepository.countByStatus(TripStatus.DRAFT);
        long completedTrips     = tripRepository.countByStatus(TripStatus.COMPLETED);
        long cancelledTrips     = tripRepository.countByStatus(TripStatus.CANCELLED);

        double utilization = totalVehicles > 0
                ? Math.round((vehiclesOnTrip * 100.0 / totalVehicles) * 100.0) / 100.0
                : 0.0;

        return DashboardResponse.builder()
                .totalVehicles(totalVehicles)
                .availableVehicles(availableVehicles)
                .vehiclesOnTrip(vehiclesOnTrip)
                .vehiclesInShop(vehiclesInShop)
                .retiredVehicles(retiredVehicles)
                .totalDrivers(totalDrivers)
                .availableDrivers(availableDrivers)
                .driversOnTrip(driversOnTrip)
                .totalTrips(totalTrips)
                .activeTrips(activeTrips)
                .pendingTrips(pendingTrips)
                .completedTrips(completedTrips)
                .cancelledTrips(cancelledTrips)
                .fleetUtilizationPercent(utilization)
                .build();
    }
}

