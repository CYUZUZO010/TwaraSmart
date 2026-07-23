package com.twarasmart.dto;
import java.util.List;
public record DashboardSummaryResponse(long activeVehicles, long totalVehicles, long inTransitShipments,
                                        double onTimeDeliveryRate, double avgFuelEfficiency,
                                        List<VehicleStatusCount> fleetBreakdown,
                                        List<DeliveryTrendPoint> deliveryTrend,
                                        List<InventoryItemResponse> lowStockItems) {}
