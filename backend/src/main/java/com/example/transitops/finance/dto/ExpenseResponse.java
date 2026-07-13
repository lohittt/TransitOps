package com.example.transitops.finance.dto;

import com.example.transitops.common.enums.ExpenseType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseResponse {

    private Long id;
    private Long vehicleId;
    private String vehicleName;
    private Long tripId;
    private ExpenseType expenseType;
    private Double amount;
    private String description;
    private LocalDate date;
}
