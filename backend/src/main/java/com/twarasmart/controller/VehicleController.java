package com.twarasmart.controller;

import com.twarasmart.dto.*;
import com.twarasmart.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {
    private final VehicleService vehicleService;
    public VehicleController(VehicleService vehicleService) { this.vehicleService = vehicleService; }

    @GetMapping
    public ResponseEntity<List<VehicleResponse>> list() { return ResponseEntity.ok(vehicleService.list()); }

    @PostMapping
    public ResponseEntity<VehicleResponse> create(@Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicleService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleResponse> update(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        return ResponseEntity.ok(vehicleService.update(id, request));
    }

    @PatchMapping("/{id}/location")
    public ResponseEntity<VehicleResponse> updateLocation(@PathVariable Long id,
                                                            @Valid @RequestBody VehicleLocationUpdateRequest request) {
        return ResponseEntity.ok(vehicleService.updateLocation(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vehicleService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
