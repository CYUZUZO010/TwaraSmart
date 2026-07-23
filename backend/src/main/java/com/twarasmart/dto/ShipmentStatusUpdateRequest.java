package com.twarasmart.dto;
import com.twarasmart.entity.ShipmentStatus;
import jakarta.validation.constraints.NotNull;
public record ShipmentStatusUpdateRequest(@NotNull ShipmentStatus status) {}
