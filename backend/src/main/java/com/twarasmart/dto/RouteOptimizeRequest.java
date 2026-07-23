package com.twarasmart.dto;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;
public record RouteOptimizeRequest(@NotEmpty List<RouteStopRequest> stops) {}
