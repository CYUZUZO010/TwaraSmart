package com.twarasmart.controller;

import com.twarasmart.dto.RouteOptimizeRequest;
import com.twarasmart.dto.RouteOptimizeResponse;
import com.twarasmart.service.RouteOptimizationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/routes")
public class RouteController {
    private final RouteOptimizationService routeOptimizationService;
    public RouteController(RouteOptimizationService routeOptimizationService) {
        this.routeOptimizationService = routeOptimizationService;
    }

    @PostMapping("/optimize")
    public ResponseEntity<RouteOptimizeResponse> optimize(@Valid @RequestBody RouteOptimizeRequest request) {
        return ResponseEntity.ok(routeOptimizationService.optimize(request));
    }
}
