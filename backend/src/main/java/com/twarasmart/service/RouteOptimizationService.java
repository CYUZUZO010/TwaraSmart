package com.twarasmart.service;

import com.twarasmart.dto.RouteOptimizeRequest;
import com.twarasmart.dto.RouteOptimizeResponse;
import com.twarasmart.dto.RouteStopRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * "AI route planning" — implemented as a nearest-neighbor greedy heuristic over
 * the supplied stops. It's not a full TSP solver, but it reliably beats an
 * unoptimized (input-order) route on realistic stop counts, which is what the
 * dashboard reports as "distance saved".
 */
@Service
public class RouteOptimizationService {

    public RouteOptimizeResponse optimize(RouteOptimizeRequest request) {
        List<RouteStopRequest> stops = request.stops();

        double naiveDistance = totalDistance(stops);

        List<RouteStopRequest> remaining = new ArrayList<>(stops);
        List<RouteStopRequest> ordered = new ArrayList<>();

        RouteStopRequest current = remaining.remove(0);
        ordered.add(current);

        while (!remaining.isEmpty()) {
            RouteStopRequest nearest = null;
            double nearestDist = Double.MAX_VALUE;
            for (RouteStopRequest candidate : remaining) {
                double dist = ShipmentService.haversineKm(current.lat(), current.lng(), candidate.lat(), candidate.lng());
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearest = candidate;
                }
            }
            ordered.add(nearest);
            remaining.remove(nearest);
            current = nearest;
        }

        double optimizedDistance = totalDistance(ordered);
        double saved = Math.max(0, naiveDistance - optimizedDistance);

        return new RouteOptimizeResponse(
                ordered,
                round2(optimizedDistance),
                round2(naiveDistance),
                round2(saved)
        );
    }

    private double totalDistance(List<RouteStopRequest> stops) {
        double total = 0;
        for (int i = 0; i < stops.size() - 1; i++) {
            RouteStopRequest a = stops.get(i);
            RouteStopRequest b = stops.get(i + 1);
            total += ShipmentService.haversineKm(a.lat(), a.lng(), b.lat(), b.lng());
        }
        return total;
    }

    private double round2(double value) {
        return Math.round(value * 100) / 100.0;
    }
}
