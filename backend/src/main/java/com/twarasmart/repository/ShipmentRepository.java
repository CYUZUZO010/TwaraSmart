package com.twarasmart.repository;

import com.twarasmart.entity.Shipment;
import com.twarasmart.entity.ShipmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ShipmentRepository extends JpaRepository<Shipment, Long> {
    List<Shipment> findByStatus(ShipmentStatus status);
    long countByStatus(ShipmentStatus status);
    List<Shipment> findByStatusOrderByCreatedAtDesc(ShipmentStatus status);
}
