package com.twarasmart.dto;
public record FuelEfficiencyResponse(Long vehicleId, String plateNumber, Double kmPerLiter, boolean belowFleetAverage) {}
