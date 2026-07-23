package com.twarasmart.dto;
import jakarta.validation.constraints.NotNull;
public record VehicleLocationUpdateRequest(@NotNull Double lat, @NotNull Double lng) {}
