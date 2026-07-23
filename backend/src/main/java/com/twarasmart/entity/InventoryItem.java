package com.twarasmart.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "inventory_items") @Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InventoryItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name = "warehouse_id", nullable = false) private Long warehouseId;
    @Column(nullable = false) private String sku;
    @Column(nullable = false) private String name;
    @Column(nullable = false) @Builder.Default private Integer quantity = 0;
    @Column(name = "reorder_threshold", nullable = false) @Builder.Default private Integer reorderThreshold = 10;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;

    @PrePersist protected void onCreate() { createdAt = LocalDateTime.now(); }
}
