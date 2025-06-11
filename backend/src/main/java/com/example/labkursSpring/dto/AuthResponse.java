package com.example.labkursSpring.dto;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String role;
    private Long id;
    private String emriMbiemri;

    public AuthResponse(String accessToken, String refreshToken, String role, Long id, String emriMbiemri) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.id = id;
        this.emriMbiemri = emriMbiemri;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmriMbiemri() {
        return emriMbiemri;
    }

    public void setEmriMbiemri(String emriMbiemri) {
        this.emriMbiemri = emriMbiemri;
    }
}
