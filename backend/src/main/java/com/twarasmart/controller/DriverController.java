package com.twarasmart.controller;

import com.twarasmart.dto.DriverRequest;
import com.twarasmart.dto.DriverResponse;
import com.twarasmart.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {
    private final DriverService driverService;
    public DriverController(DriverService driverService) { this.driverService = driverService; }

    @GetMapping
    public ResponseEntity<List<DriverResponse>> list() { return ResponseEntity.ok(driverService.list()); }

    @PostMapping
    public ResponseEntity<DriverResponse> create(@Valid @RequestBody DriverRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(driverService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DriverResponse> update(@PathVariable Long id, @Valid @RequestBody DriverRequest request) {
        return ResponseEntity.ok(driverService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        driverService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
