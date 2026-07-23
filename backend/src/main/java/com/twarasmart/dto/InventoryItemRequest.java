package com.twarasmart.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public record InventoryItemRequest(@NotNull Long warehouseId, @NotBlank String sku, @NotBlank String name,
                                    Integer quantity, Integer reorderThreshold) {}
