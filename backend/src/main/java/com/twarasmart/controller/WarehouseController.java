package com.twarasmart.controller;

import com.twarasmart.dto.WarehouseRequest;
import com.twarasmart.dto.WarehouseResponse;
import com.twarasmart.service.WarehouseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/warehouses")
public class WarehouseController {
    private final WarehouseService warehouseService;
    public WarehouseController(WarehouseService warehouseService) { this.warehouseService = warehouseService; }

    @GetMapping
    public ResponseEntity<List<WarehouseResponse>> list() { return ResponseEntity.ok(warehouseService.listWarehouses()); }

    @PostMapping
    public ResponseEntity<WarehouseResponse> create(@Valid @RequestBody WarehouseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(warehouseService.createWarehouse(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        warehouseService.deleteWarehouse(id);
        return ResponseEntity.noContent().build();
    }
}
