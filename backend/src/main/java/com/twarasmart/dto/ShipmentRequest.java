package com.twarasmart.dto;
import jakarta.validation.constraints.NotBlank;
public record ShipmentRequest(@NotBlank String origin, @NotBlank String destination,
                               Double originLat, Double originLng, Double destinationLat, Double destinationLng,
                               Long vehicleId, Long driverId, Double avgSpeedKmh) {}
