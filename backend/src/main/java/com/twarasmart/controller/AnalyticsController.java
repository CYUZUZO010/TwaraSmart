package com.twarasmart.controller;

import com.twarasmart.dto.DashboardSummaryResponse;
import com.twarasmart.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    public AnalyticsController(AnalyticsService analyticsService) { this.analyticsService = analyticsService; }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardSummaryResponse> dashboard() {
        return ResponseEntity.ok(analyticsService.getDashboard());
    }
}
