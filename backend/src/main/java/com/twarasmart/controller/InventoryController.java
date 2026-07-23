package com.twarasmart.controller;

import com.twarasmart.dto.InventoryItemRequest;
import com.twarasmart.dto.InventoryItemResponse;
import com.twarasmart.service.WarehouseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {
    private final WarehouseService warehouseService;
    public InventoryController(WarehouseService warehouseService) { this.warehouseService = warehouseService; }

    @GetMapping
    public ResponseEntity<List<InventoryItemResponse>> list(@RequestParam(required = false) Long warehouseId) {
        return ResponseEntity.ok(warehouseService.listInventory(warehouseId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryItemResponse>> lowStock() {
        return ResponseEntity.ok(warehouseService.lowStock());
    }

    @PostMapping
    public ResponseEntity<InventoryItemResponse> create(@Valid @RequestBody InventoryItemRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(warehouseService.createItem(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InventoryItemResponse> update(@PathVariable Long id, @Valid @RequestBody InventoryItemRequest request) {
        return ResponseEntity.ok(warehouseService.updateItem(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        warehouseService.deleteItem(id);
        return ResponseEntity.noContent().build();
    }
}
