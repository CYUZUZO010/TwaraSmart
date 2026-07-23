package com.twarasmart.dto;
public record InventoryItemResponse(Long id, Long warehouseId, String warehouseName, String sku, String name,
                                     Integer quantity, Integer reorderThreshold, boolean lowStock) {}
