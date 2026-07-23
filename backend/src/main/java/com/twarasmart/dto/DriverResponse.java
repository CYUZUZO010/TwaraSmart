package com.twarasmart.dto;
import com.twarasmart.entity.DriverStatus;
public record DriverResponse(Long id, String name, String licenseNumber, String phone, DriverStatus status, String assignedVehiclePlate) {}
