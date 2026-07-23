package com.twarasmart.service;

import com.twarasmart.dto.DriverRequest;
import com.twarasmart.dto.DriverResponse;
import com.twarasmart.entity.Driver;
import com.twarasmart.entity.DriverStatus;
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
public class DriverService {

    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    public DriverService(DriverRepository driverRepository, VehicleRepository vehicleRepository) {
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public List<DriverResponse> list() {
        List<Driver> drivers = driverRepository.findAll();
        Map<Long, String> plateByDriver = vehicleRepository.findAll().stream()
                .filter(v -> v.getDriverId() != null)
                .collect(Collectors.toMap(Vehicle::getDriverId, Vehicle::getPlateNumber, (a, b) -> a));
        return drivers.stream().map(d -> toResponse(d, plateByDriver.get(d.getId()))).toList();
    }

    @Transactional
    public DriverResponse create(DriverRequest request) {
        Driver driver = Driver.builder()
                .name(request.name())
                .licenseNumber(request.licenseNumber())
                .phone(request.phone())
                .status(request.status() != null ? request.status() : DriverStatus.AVAILABLE)
                .build();
        driver = driverRepository.save(driver);
        return toResponse(driver, null);
    }

    @Transactional
    public DriverResponse update(Long id, DriverRequest request) {
        Driver driver = driverRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        driver.setName(request.name());
        driver.setLicenseNumber(request.licenseNumber());
        driver.setPhone(request.phone());
        if (request.status() != null) driver.setStatus(request.status());
        driver = driverRepository.save(driver);
        return toResponse(driver, null);
    }

    @Transactional
    public void delete(Long id) {
        if (!driverRepository.existsById(id)) throw new ResourceNotFoundException("Driver not found");
        driverRepository.deleteById(id);
    }

    private DriverResponse toResponse(Driver d, String plate) {
        return new DriverResponse(d.getId(), d.getName(), d.getLicenseNumber(), d.getPhone(), d.getStatus(), plate);
    }
}
