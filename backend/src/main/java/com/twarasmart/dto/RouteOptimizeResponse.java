package com.twarasmart.dto;
import java.util.List;
public record RouteOptimizeResponse(List<RouteStopRequest> optimizedOrder, double optimizedDistanceKm,
                                     double naiveDistanceKm, double distanceSavedKm) {}
