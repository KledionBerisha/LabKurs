package com.example.labkursSpring.dto;

public class ProfileUpdateRequest {
    private String emriMbiemri;
    private String email;
    private String currentPassword;
    private String newPassword;

    public ProfileUpdateRequest() {}

    public String getEmriMbiemri() { return emriMbiemri; }
    public void setEmriMbiemri(String emriMbiemri) { this.emriMbiemri = emriMbiemri; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getCurrentPassword() { return currentPassword; }
    public void setCurrentPassword(String currentPassword) { this.currentPassword = currentPassword; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}