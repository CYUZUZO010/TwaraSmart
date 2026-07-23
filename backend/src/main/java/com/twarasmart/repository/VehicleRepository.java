package com.twarasmart.repository;

import com.twarasmart.entity.Vehicle;
import com.twarasmart.entity.VehicleStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByStatus(VehicleStatus status);
    long countByStatus(VehicleStatus status);
}
