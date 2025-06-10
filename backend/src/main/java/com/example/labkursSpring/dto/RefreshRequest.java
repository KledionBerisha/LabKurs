package com.example.labkursSpring.dto;

public record RefreshRequest(String refreshToken){
    public RefreshRequest {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new IllegalArgumentException("Refresh token cannot be null or blank");
        }
    }
    
}
