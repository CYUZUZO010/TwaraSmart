package com.twarasmart.service;

import com.twarasmart.dto.VehicleLocationUpdateRequest;
import com.twarasmart.dto.VehicleRequest;
import com.twarasmart.dto.VehicleResponse;
import com.twarasmart.entity.Driver;
import com.twarasmart.entity.Vehicle;
import com.twarasmart.exception.ResourceNotFoundException;
import com.twarasmart.repository.DriverRepository;
import com.twarasmart.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public VehicleService(VehicleRepository vehicleRepository, DriverRepository driverRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    public List<VehicleResponse> list() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        Map<Long, String> driverNames = driverRepository.findAll().stream()
                .collect(Collectors.toMap(Driver::getId, Driver::getName));
        return vehicles.stream().map(v -> toResponse(v, driverNames)).toList();
    }

    @Transactional
    public VehicleResponse create(VehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
                .plateNumber(request.plateNumber())
                .type(request.type())
                .capacityKg(request.capacityKg() != null ? request.capacityKg() : java.math.BigDecimal.ZERO)
                .status(request.status() != null ? request.status() : com.twarasmart.entity.VehicleStatus.IDLE)
                .driverId(request.driverId())
                .build();
        vehicle = vehicleRepository.save(vehicle);
        return toResponse(vehicle, driverNameLookup());
    }

    @Transactional
    public VehicleResponse update(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicle.setPlateNumber(request.plateNumber());
        vehicle.setType(request.type());
        if (request.capacityKg() != null) vehicle.setCapacityKg(request.capacityKg());
        if (request.status() != null) vehicle.setStatus(request.status());
        vehicle.setDriverId(request.driverId());
        vehicle = vehicleRepository.save(vehicle);
        return toResponse(vehicle, driverNameLookup());
    }

    @Transactional
    public VehicleResponse updateLocation(Long id, VehicleLocationUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found"));
        vehicle.setCurrentLat(request.lat());
        vehicle.setCurrentLng(request.lng());
        vehicle = vehicleRepository.save(vehicle);
        return toResponse(vehicle, driverNameLookup());
    }

    @Transactional
    public void delete(Long id) {
        if (!vehicleRepository.existsById(id)) throw new ResourceNotFoundException("Vehicle not found");
        vehicleRepository.deleteById(id);
    }

    private Map<Long, String> driverNameLookup() {
        return driverRepository.findAll().stream().collect(Collectors.toMap(Driver::getId, Driver::getName));
    }

    private VehicleResponse toResponse(Vehicle v, Map<Long, String> driverNames) {
        String driverName = v.getDriverId() != null ? driverNames.get(v.getDriverId()) : null;
        return new VehicleResponse(v.getId(), v.getPlateNumber(), v.getType(), v.getCapacityKg(), v.getStatus(),
                v.getDriverId(), driverName, v.getCurrentLat(), v.getCurrentLng());
    }
}
