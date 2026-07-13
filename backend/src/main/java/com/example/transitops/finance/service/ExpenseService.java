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
import com.example.transitops.finance.dto.ExpenseRequest;
import com.example.transitops.finance.dto.ExpenseResponse;

import java.util.List;

public interface ExpenseService {
    ExpenseResponse create(ExpenseRequest request);
    List<ExpenseResponse> findAll();
    ExpenseResponse findById(Long id);
    ExpenseResponse update(Long id, ExpenseRequest request);
    void delete(Long id);
}

