package com.twarasmart.dto;
import com.twarasmart.entity.ShipmentStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
public record ShipmentResponse(Long id, String origin, String destination, Long vehicleId, String vehiclePlate,
                                Long driverId, String driverName, ShipmentStatus status, BigDecimal distanceKm,
                                BigDecimal avgSpeedKmh, LocalDateTime eta, LocalDateTime createdAt, LocalDateTime deliveredAt) {}
