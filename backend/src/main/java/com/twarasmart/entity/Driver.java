package com.twarasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "drivers") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Driver {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(nullable = false) private String name;
    @Column(name = "license_number", nullable = false) private String licenseNumber;
    private String phone;
    @Enumerated(EnumType.STRING) @Column(nullable = false) @Builder.Default
    private DriverStatus status = DriverStatus.AVAILABLE;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
