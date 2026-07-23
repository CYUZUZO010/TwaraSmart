package com.twarasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "fuel_logs") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FuelLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "vehicle_id", nullable = false) private Long vehicleId;
    @Column(nullable = false) private BigDecimal liters;
    @Column(nullable = false) private BigDecimal cost;
    @Column(name = "odometer_km", nullable = false) private BigDecimal odometerKm;
    @Column(name = "logged_at", nullable = false) private LocalDateTime loggedAt;

    @PrePersist protected void onCreate() { if (loggedAt == null) loggedAt = LocalDateTime.now(); }
}
