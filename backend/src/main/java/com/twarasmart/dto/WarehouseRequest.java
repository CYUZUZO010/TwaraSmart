package com.twarasmart.dto;
import jakarta.validation.constraints.NotBlank;
public record WarehouseRequest(@NotBlank String name, @NotBlank String location, Double latitude, Double longitude, Integer capacityUnits) {}
