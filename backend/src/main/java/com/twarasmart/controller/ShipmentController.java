package com.twarasmart.controller;

import com.twarasmart.dto.ShipmentRequest;
import com.twarasmart.dto.ShipmentResponse;
import com.twarasmart.dto.ShipmentStatusUpdateRequest;
import com.twarasmart.service.ShipmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/shipments")
public class ShipmentController {
    private final ShipmentService shipmentService;
    public ShipmentController(ShipmentService shipmentService) { this.shipmentService = shipmentService; }

    @GetMapping
    public ResponseEntity<List<ShipmentResponse>> list() { return ResponseEntity.ok(shipmentService.list()); }

    @PostMapping
    public ResponseEntity<ShipmentResponse> create(@Valid @RequestBody ShipmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shipmentService.create(request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ShipmentResponse> updateStatus(@PathVariable Long id,
                                                           @Valid @RequestBody ShipmentStatusUpdateRequest request) {
        return ResponseEntity.ok(shipmentService.updateStatus(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        shipmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
