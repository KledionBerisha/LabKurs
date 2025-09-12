package com.example.labkursSpring.dto;

public class ProfileResponse {
    private Long userId;
    private String email;
    private String emriMbiemri;

    public ProfileResponse() {}

    public ProfileResponse(Long userId, String email, String emriMbiemri) {
        this.userId = userId;
        this.email = email;
        this.emriMbiemri = emriMbiemri;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEmriMbiemri() { return emriMbiemri; }
    public void setEmriMbiemri(String emriMbiemri) { this.emriMbiemri = emriMbiemri; }
}