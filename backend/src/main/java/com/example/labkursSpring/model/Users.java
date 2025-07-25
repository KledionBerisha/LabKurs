package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Users")
public class Users {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserID")
    private Long userId;

    private String email;
    private String password;

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}