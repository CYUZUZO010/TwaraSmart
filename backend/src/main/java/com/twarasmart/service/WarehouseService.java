package com.twarasmart.service;

import com.twarasmart.dto.*;
import com.twarasmart.entity.InventoryItem;
import com.twarasmart.entity.Warehouse;
import com.twarasmart.exception.ResourceNotFoundException;
import com.twarasmart.repository.InventoryItemRepository;
import com.twarasmart.repository.WarehouseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final InventoryItemRepository inventoryItemRepository;

    public WarehouseService(WarehouseRepository warehouseRepository, InventoryItemRepository inventoryItemRepository) {
        this.warehouseRepository = warehouseRepository;
        this.inventoryItemRepository = inventoryItemRepository;
    }

    public List<WarehouseResponse> listWarehouses() {
        List<Warehouse> warehouses = warehouseRepository.findAll();
        Map<Long, Long> counts = inventoryItemRepository.findAll().stream()
                .collect(Collectors.groupingBy(InventoryItem::getWarehouseId, Collectors.counting()));
        return warehouses.stream()
                .map(w -> new WarehouseResponse(w.getId(), w.getName(), w.getLocation(), w.getLatitude(),
                        w.getLongitude(), w.getCapacityUnits(), counts.getOrDefault(w.getId(), 0L).intValue()))
                .toList();
    }

    @Transactional
    public WarehouseResponse createWarehouse(WarehouseRequest request) {
        Warehouse warehouse = Warehouse.builder()
                .name(request.name())
                .location(request.location())
                .latitude(request.latitude())
                .longitude(request.longitude())
                .capacityUnits(request.capacityUnits() != null ? request.capacityUnits() : 0)
                .build();
        warehouse = warehouseRepository.save(warehouse);
        return new WarehouseResponse(warehouse.getId(), warehouse.getName(), warehouse.getLocation(),
                warehouse.getLatitude(), warehouse.getLongitude(), warehouse.getCapacityUnits(), 0);
    }

    @Transactional
    public void deleteWarehouse(Long id) {
        if (!warehouseRepository.existsById(id)) throw new ResourceNotFoundException("Warehouse not found");
        warehouseRepository.deleteById(id);
    }

    public List<InventoryItemResponse> listInventory(Long warehouseId) {
        Map<Long, String> warehouseNames = warehouseRepository.findAll().stream()
                .collect(Collectors.toMap(Warehouse::getId, Warehouse::getName));
        List<InventoryItem> items = warehouseId != null
                ? inventoryItemRepository.findByWarehouseId(warehouseId)
                : inventoryItemRepository.findAll();
        return items.stream().map(i -> toResponse(i, warehouseNames)).toList();
    }

    public List<InventoryItemResponse> lowStock() {
        Map<Long, String> warehouseNames = warehouseRepository.findAll().stream()
                .collect(Collectors.toMap(Warehouse::getId, Warehouse::getName));
        return inventoryItemRepository.findLowStock().stream().map(i -> toResponse(i, warehouseNames)).toList();
    }

    @Transactional
    public InventoryItemResponse createItem(InventoryItemRequest request) {
        if (!warehouseRepository.existsById(request.warehouseId())) {
            throw new ResourceNotFoundException("Warehouse not found");
        }
        InventoryItem item = InventoryItem.builder()
                .warehouseId(request.warehouseId())
                .sku(request.sku())
                .name(request.name())
                .quantity(request.quantity() != null ? request.quantity() : 0)
                .reorderThreshold(request.reorderThreshold() != null ? request.reorderThreshold() : 10)
                .build();
        item = inventoryItemRepository.save(item);
        return toResponse(item, warehouseNameLookup());
    }

    @Transactional
    public InventoryItemResponse updateItem(Long id, InventoryItemRequest request) {
        InventoryItem item = inventoryItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory item not found"));
        item.setSku(request.sku());
        item.setName(request.name());
        if (request.quantity() != null) item.setQuantity(request.quantity());
        if (request.reorderThreshold() != null) item.setReorderThreshold(request.reorderThreshold());
        item = inventoryItemRepository.save(item);
        return toResponse(item, warehouseNameLookup());
    }

    @Transactional
    public void deleteItem(Long id) {
        if (!inventoryItemRepository.existsById(id)) throw new ResourceNotFoundException("Inventory item not found");
        inventoryItemRepository.deleteById(id);
    }

    private Map<Long, String> warehouseNameLookup() {
        return warehouseRepository.findAll().stream().collect(Collectors.toMap(Warehouse::getId, Warehouse::getName));
    }

    private InventoryItemResponse toResponse(InventoryItem i, Map<Long, String> warehouseNames) {
        return new InventoryItemResponse(i.getId(), i.getWarehouseId(), warehouseNames.get(i.getWarehouseId()),
                i.getSku(), i.getName(), i.getQuantity(), i.getReorderThreshold(),
                i.getQuantity() <= i.getReorderThreshold());
    }
}
