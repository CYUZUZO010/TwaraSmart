package com.twarasmart.service;

import com.twarasmart.dto.FuelEfficiencyResponse;
import com.twarasmart.dto.FuelLogRequest;
import com.twarasmart.entity.FuelLog;
import com.twarasmart.entity.Vehicle;
import com.twarasmart.exception.ResourceNotFoundException;
import com.twarasmart.repository.FuelLogRepository;
import com.twarasmart.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FuelService {

    private final FuelLogRepository fuelLogRepository;
    private final VehicleRepository vehicleRepository;

    public FuelService(FuelLogRepository fuelLogRepository, VehicleRepository vehicleRepository) {
        this.fuelLogRepository = fuelLogRepository;
        this.vehicleRepository = vehicleRepository;
    }

    @Transactional
    public void logFuel(FuelLogRequest request) {
        if (!vehicleRepository.existsById(request.vehicleId())) {
            throw new ResourceNotFoundException("Vehicle not found");
        }
        FuelLog log = FuelLog.builder()
                .vehicleId(request.vehicleId())
                .liters(request.liters())
                .cost(request.cost())
                .odometerKm(request.odometerKm())
                .build();
        fuelLogRepository.save(log);
    }

    /**
     * Computes km/liter per vehicle from consecutive fuel-log odometer readings,
     * then flags vehicles trending below the fleet average — this is the
     * "fuel optimization" signal surfaced on the dashboard and fleet page.
     */
    public List<FuelEfficiencyResponse> fleetEfficiency() {
        Map<Long, String> plates = vehicleRepository.findAll().stream()
                .collect(Collectors.toMap(Vehicle::getId, Vehicle::getPlateNumber));

        List<FuelEfficiencyResponse> results = new ArrayList<>();
        Map<Long, Double> rawEfficiency = new java.util.HashMap<>();

        for (Long vehicleId : plates.keySet()) {
            List<FuelLog> logs = fuelLogRepository.findByVehicleIdOrderByOdometerKmAsc(vehicleId);
            if (logs.size() < 2) continue;

            double totalKm = logs.get(logs.size() - 1).getOdometerKm().doubleValue() - logs.get(0).getOdometerKm().doubleValue();
            double totalLiters = logs.stream()
                    .skip(1)
                    .map(FuelLog::getLiters)
                    .map(BigDecimal::doubleValue)
                    .reduce(0.0, Double::sum);

            if (totalLiters > 0 && totalKm > 0) {
                rawEfficiency.put(vehicleId, totalKm / totalLiters);
            }
        }

        double fleetAverage = rawEfficiency.values().stream().mapToDouble(Double::doubleValue).average().orElse(0);

        for (Map.Entry<Long, Double> entry : rawEfficiency.entrySet()) {
            double kmPerLiter = Math.round(entry.getValue() * 100) / 100.0;
            results.add(new FuelEfficiencyResponse(entry.getKey(), plates.get(entry.getKey()), kmPerLiter,
                    kmPerLiter < fleetAverage));
        }

        return results;
    }

    public double fleetAverageEfficiency() {
        List<FuelEfficiencyResponse> efficiency = fleetEfficiency();
        return efficiency.stream().mapToDouble(FuelEfficiencyResponse::kmPerLiter).average().orElse(0);
    }
}
