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
import com.example.transitops.finance.dto.ExpenseRequest;
import com.example.transitops.finance.dto.ExpenseResponse;
import com.example.transitops.finance.entity.Expense;
import com.example.transitops.finance.mapper.ExpenseMapper;
import com.example.transitops.finance.repository.ExpenseRepository;
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
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final ExpenseMapper expenseMapper;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository, VehicleRepository vehicleRepository,
                              TripRepository tripRepository, ExpenseMapper expenseMapper) {
        this.expenseRepository = expenseRepository;
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
        this.expenseMapper = expenseMapper;
    }

    @Override
    public ExpenseResponse create(ExpenseRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        Expense expense = expenseMapper.toEntity(request);
        expense.setVehicle(vehicle);

        if (request.getTripId() != null) {
            Trip trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.getTripId()));
            expense.setTrip(trip);
        }

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> findAll() {
        return expenseRepository.findAll().stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse findById(Long id) {
        return expenseMapper.toResponse(getExpense(id));
    }

    @Override
    public ExpenseResponse update(Long id, ExpenseRequest request) {
        Expense expense = getExpense(id);
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + request.getVehicleId()));

        expense.setVehicle(vehicle);
        expense.setExpenseType(request.getExpenseType());
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setDate(request.getDate());

        if (request.getTripId() != null) {
            Trip trip = tripRepository.findById(request.getTripId())
                    .orElseThrow(() -> new ResourceNotFoundException("Trip not found with id: " + request.getTripId()));
            expense.setTrip(trip);
        } else {
            expense.setTrip(null);
        }

        return expenseMapper.toResponse(expenseRepository.save(expense));
    }

    @Override
    public void delete(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }

    private Expense getExpense(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
    }
}

