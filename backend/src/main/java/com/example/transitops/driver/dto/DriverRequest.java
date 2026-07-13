package com.example.transitops.driver.dto;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class DriverRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "License number is required")
    private String licenseNumber;

    @NotBlank(message = "License category is required")
    private String licenseCategory;

    @NotNull(message = "License expiry date is required")
    private LocalDate licenseExpiryDate;

    @NotBlank(message = "Email is required")
    @jakarta.validation.constraints.Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Contact number is required")
    private String contactNumber;

    @DecimalMin(value = "0.0", message = "Safety score must be at least 0")
    @DecimalMax(value = "10.0", message = "Safety score must be at most 10")
    private Double safetyScore = 5.0;
}
