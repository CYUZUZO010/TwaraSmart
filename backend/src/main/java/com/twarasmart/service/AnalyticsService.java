package com.twarasmart.service;

import com.twarasmart.dto.*;
import com.twarasmart.entity.Shipment;
import com.twarasmart.entity.ShipmentStatus;
import com.twarasmart.entity.VehicleStatus;
import com.twarasmart.repository.ShipmentRepository;
import com.twarasmart.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class AnalyticsService {

    private final VehicleRepository vehicleRepository;
    private final ShipmentRepository shipmentRepository;
    private final WarehouseService warehouseService;
    private final FuelService fuelService;

    public AnalyticsService(VehicleRepository vehicleRepository, ShipmentRepository shipmentRepository,
                             WarehouseService warehouseService, FuelService fuelService) {
        this.vehicleRepository = vehicleRepository;
        this.shipmentRepository = shipmentRepository;
        this.warehouseService = warehouseService;
        this.fuelService = fuelService;
    }

    public DashboardSummaryResponse getDashboard() {
        long activeVehicles = vehicleRepository.countByStatus(VehicleStatus.ACTIVE);
        long totalVehicles = vehicleRepository.count();
        long inTransit = shipmentRepository.countByStatus(ShipmentStatus.IN_TRANSIT);

        long delivered = shipmentRepository.countByStatus(ShipmentStatus.DELIVERED);
        long delayed = shipmentRepository.countByStatus(ShipmentStatus.DELAYED);
        double onTimeRate = (delivered + delayed) > 0
                ? Math.round((delivered * 1000.0) / (delivered + delayed)) / 10.0
                : 0;

        double avgFuelEfficiency = Math.round(fuelService.fleetAverageEfficiency() * 100) / 100.0;

        List<VehicleStatusCount> fleetBreakdown = List.of(
                new VehicleStatusCount("ACTIVE", vehicleRepository.countByStatus(VehicleStatus.ACTIVE)),
                new VehicleStatusCount("MAINTENANCE", vehicleRepository.countByStatus(VehicleStatus.MAINTENANCE)),
                new VehicleStatusCount("IDLE", vehicleRepository.countByStatus(VehicleStatus.IDLE))
        );

        List<DeliveryTrendPoint> trend = buildTrend();
        List<InventoryItemResponse> lowStock = warehouseService.lowStock();

        return new DashboardSummaryResponse(activeVehicles, totalVehicles, inTransit, onTimeRate,
                avgFuelEfficiency, fleetBreakdown, trend, lowStock);
    }

    private List<DeliveryTrendPoint> buildTrend() {
        List<Shipment> all = shipmentRepository.findAll();
        List<DeliveryTrendPoint> points = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate day = LocalDate.now().minusDays(i);
            long delivered = all.stream()
                    .filter(s -> s.getDeliveredAt() != null && s.getDeliveredAt().toLocalDate().equals(day))
                    .count();
            long delayed = all.stream()
                    .filter(s -> s.getStatus() == ShipmentStatus.DELAYED && s.getCreatedAt().toLocalDate().equals(day))
                    .count();
            String label = day.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            points.add(new DeliveryTrendPoint(label, delivered, delayed));
        }
        return points;
    }
}
