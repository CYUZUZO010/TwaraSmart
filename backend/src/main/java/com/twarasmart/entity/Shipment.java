package com.twarasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity @Table(name = "shipments") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Shipment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String origin;
    @Column(nullable = false) private String destination;
    @Column(name = "origin_lat") private Double originLat;
    @Column(name = "origin_lng") private Double originLng;
    @Column(name = "destination_lat") private Double destinationLat;
    @Column(name = "destination_lng") private Double destinationLng;
    @Column(name = "vehicle_id") private Long vehicleId;
    @Column(name = "driver_id") private Long driverId;
    @Enumerated(EnumType.STRING) @Column(nullable = false) @Builder.Default
    private ShipmentStatus status = ShipmentStatus.PENDING;
    @Column(name = "distance_km") private BigDecimal distanceKm;
    @Column(name = "avg_speed_kmh", nullable = false) @Builder.Default private BigDecimal avgSpeedKmh = BigDecimal.valueOf(40);
    private LocalDateTime eta;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;
    @Column(name = "delivered_at") private LocalDateTime deliveredAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
