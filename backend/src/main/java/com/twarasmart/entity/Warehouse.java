package com.twarasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "warehouses") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Warehouse {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    @Column(nullable = false) private String location;
    private Double latitude;
    private Double longitude;
    @Column(name = "capacity_units", nullable = false) @Builder.Default private Integer capacityUnits = 0;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
