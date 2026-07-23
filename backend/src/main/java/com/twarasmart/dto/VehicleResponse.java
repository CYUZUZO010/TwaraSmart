package com.twarasmart.dto;
import com.twarasmart.entity.VehicleStatus;
import com.twarasmart.entity.VehicleType;
import java.math.BigDecimal;
public record VehicleResponse(Long id, String plateNumber, VehicleType type, BigDecimal capacityKg,
                               VehicleStatus status, Long driverId, String driverName,
                               Double currentLat, Double currentLng) {}
