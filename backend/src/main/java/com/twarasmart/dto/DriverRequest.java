package com.twarasmart.dto;
import com.twarasmart.entity.DriverStatus;
import jakarta.validation.constraints.NotBlank;
public record DriverRequest(@NotBlank String name, @NotBlank String licenseNumber, String phone, DriverStatus status) {}
