package com.twarasmart.controller;

import com.twarasmart.dto.FuelEfficiencyResponse;
import com.twarasmart.dto.FuelLogRequest;
import com.twarasmart.service.FuelService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/fuel")
public class FuelController {
    private final FuelService fuelService;
    public FuelController(FuelService fuelService) { this.fuelService = fuelService; }

    @PostMapping("/logs")
    public ResponseEntity<Void> log(@Valid @RequestBody FuelLogRequest request) {
        fuelService.logFuel(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/efficiency")
    public ResponseEntity<List<FuelEfficiencyResponse>> efficiency() {
        return ResponseEntity.ok(fuelService.fleetEfficiency());
    }
}
