package com.twarasmart.service;

import com.twarasmart.dto.ShipmentRequest;
import com.twarasmart.dto.ShipmentResponse;
import com.twarasmart.dto.ShipmentStatusUpdateRequest;
import com.twarasmart.entity.Driver;
import com.twarasmart.entity.Shipment;
import com.twarasmart.entity.ShipmentStatus;
import com.twarasmart.entity.Vehicle;
import com.twarasmart.exception.ResourceNotFoundException;
import com.twarasmart.repository.DriverRepository;
import com.twarasmart.repository.ShipmentRepository;
import com.twarasmart.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public ShipmentService(ShipmentRepository shipmentRepository, VehicleRepository vehicleRepository,
                            DriverRepository driverRepository) {
        this.shipmentRepository = shipmentRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    public List<ShipmentResponse> list() {
        List<Shipment> shipments = shipmentRepository.findAll();
        return enrich(shipments);
    }

    @Transactional
    public ShipmentResponse create(ShipmentRequest request) {
        BigDecimal avgSpeed = request.avgSpeedKmh() != null
                ? BigDecimal.valueOf(request.avgSpeedKmh()) : BigDecimal.valueOf(40);

        BigDecimal distance = null;
        LocalDateTime eta = null;
        if (request.originLat() != null && request.originLng() != null
                && request.destinationLat() != null && request.destinationLng() != null) {
            double distKm = haversineKm(request.originLat(), request.originLng(),
                    request.destinationLat(), request.destinationLng());
            distance = BigDecimal.valueOf(distKm).setScale(2, RoundingMode.HALF_UP);
            double hours = distKm / avgSpeed.doubleValue();
            eta = LocalDateTime.now().plusMinutes((long) (hours * 60));
        }

        Shipment shipment = Shipment.builder()
                .origin(request.origin())
                .destination(request.destination())
                .originLat(request.originLat())
                .originLng(request.originLng())
                .destinationLat(request.destinationLat())
                .destinationLng(request.destinationLng())
                .vehicleId(request.vehicleId())
                .driverId(request.driverId())
                .status(ShipmentStatus.PENDING)
                .distanceKm(distance)
                .avgSpeedKmh(avgSpeed)
                .eta(eta)
                .build();

        shipment = shipmentRepository.save(shipment);
        return enrich(List.of(shipment)).get(0);
    }

    @Transactional
    public ShipmentResponse updateStatus(Long id, ShipmentStatusUpdateRequest request) {
        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Shipment not found"));
        shipment.setStatus(request.status());
        if (request.status() == ShipmentStatus.DELIVERED) {
            shipment.setDeliveredAt(LocalDateTime.now());
        }
        shipment = shipmentRepository.save(shipment);
        return enrich(List.of(shipment)).get(0);
    }

    @Transactional
    public void delete(Long id) {
        if (!shipmentRepository.existsById(id)) throw new ResourceNotFoundException("Shipment not found");
        shipmentRepository.deleteById(id);
    }

    private List<ShipmentResponse> enrich(List<Shipment> shipments) {
        Map<Long, String> vehiclePlates = vehicleRepository.findAll().stream()
                .collect(Collectors.toMap(Vehicle::getId, Vehicle::getPlateNumber));
        Map<Long, String> driverNames = driverRepository.findAll().stream()
                .collect(Collectors.toMap(Driver::getId, Driver::getName));

        return shipments.stream().map(s -> new ShipmentResponse(
                s.getId(), s.getOrigin(), s.getDestination(),
                s.getVehicleId(), s.getVehicleId() != null ? vehiclePlates.get(s.getVehicleId()) : null,
                s.getDriverId(), s.getDriverId() != null ? driverNames.get(s.getDriverId()) : null,
                s.getStatus(), s.getDistanceKm(), s.getAvgSpeedKmh(), s.getEta(), s.getCreatedAt(), s.getDeliveredAt()
        )).toList();
    }

    /** Great-circle distance between two lat/lng points, in kilometers. */
    static double haversineKm(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}
