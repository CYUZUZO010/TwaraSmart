package com.twarasmart.dto;
import com.twarasmart.entity.VehicleStatus;
import com.twarasmart.entity.VehicleType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
public record VehicleRequest(@NotBlank String plateNumber, @NotNull VehicleType type, BigDecimal capacityKg,
                              VehicleStatus status, Long driverId) {}
