package com.twarasmart.dto;
public record AuthResponse(String accessToken, String refreshToken, UserResponse user) {}
