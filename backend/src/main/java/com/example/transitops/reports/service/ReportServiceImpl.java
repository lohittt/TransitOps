package com.example.transitops.reports.service;


// Analytics & Reporting Module.
//
// Aggregates data across modules to provide actionable insights.
// 
// Key Metrics: Fleet Utilization, Fuel Efficiency, Operational Costs, ROI.
import com.example.transitops.common.enums.TripStatus;
import com.example.transitops.common.enums.VehicleStatus;
import com.example.transitops.common.util.CsvExporter;
import com.example.transitops.finance.repository.ExpenseRepository;
import com.example.transitops.finance.repository.FuelLogRepository;
import com.example.transitops.maintenance.repository.MaintenanceRepository;
import com.example.transitops.reports.dto.*;
import com.example.transitops.trip.entity.Trip;
import com.example.transitops.trip.repository.TripRepository;
import com.example.transitops.vehicle.entity.Vehicle;
import com.example.transitops.vehicle.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ReportServiceImpl implements ReportService {

    private final VehicleRepository vehicleRepository;
    private final FuelLogRepository fuelLogRepository;
    private final ExpenseRepository expenseRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final TripRepository tripRepository;

    public ReportServiceImpl(VehicleRepository vehicleRepository,
                             FuelLogRepository fuelLogRepository,
                             ExpenseRepository expenseRepository,
                             MaintenanceRepository maintenanceRepository,
                             TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.fuelLogRepository = fuelLogRepository;
        this.expenseRepository = expenseRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    public List<FuelEfficiencyResponse> getFuelEfficiency() {
        return vehicleRepository.findAll().stream().map(vehicle -> {
            Double totalLiters = fuelLogRepository.sumLitersByVehicleId(vehicle.getId());
            Double totalFuelCost = fuelLogRepository.sumCostByVehicleId(vehicle.getId());

            // Total distance from completed trips
            double totalDistance = tripRepository.findByVehicleId(vehicle.getId()).stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED && t.getActualDistance() != null)
                    .mapToDouble(t -> t.getActualDistance())
                    .sum();

            double kmPerLiter = (totalLiters != null && totalLiters > 0 && totalDistance > 0)
                    ? Math.round((totalDistance / totalLiters) * 100.0) / 100.0 : 0.0;

            double costPerKm = (totalFuelCost != null && totalFuelCost > 0 && totalDistance > 0)
                    ? Math.round((totalFuelCost / totalDistance) * 100.0) / 100.0 : 0.0;

            return FuelEfficiencyResponse.builder()
                    .vehicleId(vehicle.getId())
                    .vehicleName(vehicle.getVehicleName())
                    .registrationNumber(vehicle.getRegistrationNumber())
                    .totalLiters(totalLiters != null ? totalLiters : 0.0)
                    .totalDistanceKm(totalDistance)
                    .kmPerLiter(kmPerLiter)
                    .costPerKm(costPerKm)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public FleetUtilizationResponse getFleetUtilization() {
        long total              = vehicleRepository.count();
        long available          = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long onTrip             = vehicleRepository.countByStatus(VehicleStatus.ON_TRIP);
        long inShop             = vehicleRepository.countByStatus(VehicleStatus.IN_SHOP);
        long retired            = vehicleRepository.countByStatus(VehicleStatus.RETIRED);
        long completedTrips     = tripRepository.countByStatus(TripStatus.COMPLETED);

        double utilization = total > 0
                ? Math.round((onTrip * 100.0 / total) * 100.0) / 100.0 : 0.0;

        double avgTrips = total > 0
                ? Math.round((completedTrips * 100.0 / total) * 100.0) / 100.0 : 0.0;

        return FleetUtilizationResponse.builder()
                .totalVehicles(total)
                .availableVehicles(available)
                .vehiclesOnTrip(onTrip)
                .vehiclesInShop(inShop)
                .retiredVehicles(retired)
                .utilizationPercent(utilization)
                .totalCompletedTrips(completedTrips)
                .averageTripsPerVehicle(avgTrips)
                .build();
    }

    @Override
    public List<OperationalCostResponse> getOperationalCost() {
        return vehicleRepository.findAll().stream().map(vehicle -> {
            Double fuelCost        = fuelLogRepository.sumCostByVehicleId(vehicle.getId());
            Double expenseCost     = expenseRepository.sumAmountByVehicleId(vehicle.getId());

            double maintenanceCost = maintenanceRepository.findByVehicleId(vehicle.getId()).stream()
                    .mapToDouble(m -> m.getCost() != null ? m.getCost() : 0.0)
                    .sum();

            double totalFuel     = fuelCost != null ? fuelCost : 0.0;
            double totalExpense  = expenseCost != null ? expenseCost : 0.0;
            double totalOps      = Math.round((totalFuel + totalExpense + maintenanceCost) * 100.0) / 100.0;

            return OperationalCostResponse.builder()
                    .vehicleId(vehicle.getId())
                    .vehicleName(vehicle.getVehicleName())
                    .registrationNumber(vehicle.getRegistrationNumber())
                    .totalFuelCost(totalFuel)
                    .totalExpenses(totalExpense)
                    .totalMaintenanceCost(maintenanceCost)
                    .totalOperationalCost(totalOps)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public List<VehicleROIResponse> getVehicleROI() {
        return vehicleRepository.findAll().stream().map(vehicle -> {
            double fuelCost    = orZero(fuelLogRepository.sumCostByVehicleId(vehicle.getId()));
            double maintCost   = maintenanceRepository.findByVehicleId(vehicle.getId()).stream()
                    .mapToDouble(m -> m.getCost() != null ? m.getCost() : 0.0).sum();

            // PDF ROI Formula: [Revenue - (Maintenance + Fuel)] / Acquisition Cost
            double totalRevenue = tripRepository.findByVehicleId(vehicle.getId()).stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED && t.getRevenue() != null)
                    .mapToDouble(Trip::getRevenue)
                    .sum();

            double totalDistance = tripRepository.findByVehicleId(vehicle.getId()).stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED && t.getActualDistance() != null)
                    .mapToDouble(Trip::getActualDistance)
                    .sum();

            long completedTrips = tripRepository.findByVehicleId(vehicle.getId()).stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED)
                    .count();

            double totalOps = fuelCost + maintCost;

            double costPerKm = (totalOps > 0 && totalDistance > 0)
                    ? Math.round((totalOps / totalDistance) * 100.0) / 100.0 : 0.0;

            // ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
            double roiScore = vehicle.getAcquisitionCost() > 0
                    ? Math.round(((totalRevenue - totalOps) / vehicle.getAcquisitionCost()) * 10000.0) / 10000.0
                    : 0.0;

            return VehicleROIResponse.builder()
                    .vehicleId(vehicle.getId())
                    .vehicleName(vehicle.getVehicleName())
                    .registrationNumber(vehicle.getRegistrationNumber())
                    .acquisitionCost(vehicle.getAcquisitionCost())
                    .totalRevenue(totalRevenue)
                    .totalOperationalCost(totalOps)
                    .totalDistanceKm(totalDistance)
                    .completedTrips(completedTrips)
                    .costPerKm(costPerKm)
                    .roiScore(roiScore)
                    .build();
        }).collect(Collectors.toList());
    }

    @Override
    public CsvExportResponse exportCsv() {
        List<Vehicle> vehicles = vehicleRepository.findAll();

        List<String> headers = List.of(
                "VehicleId", "RegistrationNumber", "VehicleName", "Status",
                "TotalFuelCost", "TotalExpenses", "TotalOperationalCost", "TotalDistanceKm", "CompletedTrips", "Revenue", "ROI"
        );

        List<List<String>> rows = vehicles.stream().map(vehicle -> {
            double fuelCost  = orZero(fuelLogRepository.sumCostByVehicleId(vehicle.getId()));
            double expCost   = orZero(expenseRepository.sumAmountByVehicleId(vehicle.getId()));
            double maintCost = maintenanceRepository.findByVehicleId(vehicle.getId()).stream()
                    .mapToDouble(m -> m.getCost() != null ? m.getCost() : 0.0).sum();
            double totalOps  = fuelCost + expCost + maintCost;

            double totalDistance = tripRepository.findByVehicleId(vehicle.getId()).stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED && t.getActualDistance() != null)
                    .mapToDouble(t -> t.getActualDistance()).sum();

            long completedTrips = tripRepository.findByVehicleId(vehicle.getId()).stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED).count();

            double totalRevenue = tripRepository.findByVehicleId(vehicle.getId()).stream()
                    .filter(t -> t.getStatus() == TripStatus.COMPLETED && t.getRevenue() != null)
                    .mapToDouble(Trip::getRevenue).sum();

            double roi = vehicle.getAcquisitionCost() > 0
                    ? Math.round(((totalRevenue - (fuelCost + maintCost)) / vehicle.getAcquisitionCost()) * 10000.0) / 10000.0
                    : 0.0;

            return List.of(
                    String.valueOf(vehicle.getId()),
                    vehicle.getRegistrationNumber(),
                    vehicle.getVehicleName(),
                    vehicle.getStatus().name(),
                    String.valueOf(fuelCost),
                    String.valueOf(expCost),
                    String.valueOf(totalOps),
                    String.valueOf(totalDistance),
                    String.valueOf(completedTrips),
                    String.valueOf(totalRevenue),
                    String.valueOf(roi)
            );
        }).collect(Collectors.toList());

        String csv = CsvExporter.toCsv(headers, rows);

        return CsvExportResponse.builder()
                .filename("transitops_fleet_report.csv")
                .contentType("text/csv")
                .csvData(csv)
                .build();
    }

    private double orZero(Double value) {
        return value != null ? value : 0.0;
    }
}

