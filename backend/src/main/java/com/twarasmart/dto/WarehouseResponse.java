package com.twarasmart.dto;
public record WarehouseResponse(Long id, String name, String location, Double latitude, Double longitude,
                                 Integer capacityUnits, int itemCount) {}
