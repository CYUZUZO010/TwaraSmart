package com.twarasmart.repository;

import com.twarasmart.entity.FuelLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FuelLogRepository extends JpaRepository<FuelLog, Long> {
    List<FuelLog> findByVehicleIdOrderByOdometerKmAsc(Long vehicleId);
    List<FuelLog> findAllByOrderByLoggedAtDesc();
}
