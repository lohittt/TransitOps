package com.example.transitops.finance.repository;


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
import com.example.transitops.finance.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long>, JpaSpecificationExecutor<Expense> {
    List<Expense> findByVehicleId(Long vehicleId);
    List<Expense> findByTripId(Long tripId);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.vehicle.id = :vehicleId")
    Double sumAmountByVehicleId(Long vehicleId);
}

