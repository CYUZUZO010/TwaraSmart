package com.twarasmart.dto;
import jakarta.validation.constraints.*;
public record RegisterRequest(@Email @NotBlank String email, @NotBlank @Size(min=8) String password, @NotBlank String fullName) {}
