package com.twarasmart.dto;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
public record RouteStopRequest(@NotBlank String name, @NotNull Double lat, @NotNull Double lng) {}
