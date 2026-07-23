package com.twarasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "vehicles") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vehicle {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "plate_number", nullable = false, unique = true) private String plateNumber;
    @Enumerated(EnumType.STRING) @Column(nullable = false) private VehicleType type;
    @Column(name = "capacity_kg", nullable = false) @Builder.Default private BigDecimal capacityKg = BigDecimal.ZERO;
    @Enumerated(EnumType.STRING) @Column(nullable = false) @Builder.Default
    private VehicleStatus status = VehicleStatus.IDLE;
    @Column(name = "driver_id") private Long driverId;
    @Column(name = "current_lat") private Double currentLat;
    @Column(name = "current_lng") private Double currentLng;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(name = "updated_at", nullable = false) private LocalDateTime updatedAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); updatedAt = LocalDateTime.now(); }
    @PreUpdate protected void onUpdate() { updatedAt = LocalDateTime.now(); }
}
