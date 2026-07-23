package com.twarasmart.dto;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
public record FuelLogRequest(@NotNull Long vehicleId, @NotNull @Positive BigDecimal liters,
                              @NotNull BigDecimal cost, @NotNull BigDecimal odometerKm) {}
