package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Doktori")
public class Doktori {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DoktoriID")
    private Long doktoriId;

    @Column(name = "Username", nullable = false, unique = true)
    private String username;

    @Column(name = "Password", nullable = false)
    private String password;

    @ManyToOne
    @JoinColumn(name = "UserID")
    private Users user;

    @Column(name = "EmriMbiemri", nullable = false)
    private String emriMbiemri;

    // Getters and Setters
    public Long getDoktoriId() {
        return doktoriId;
    }

    public void setDoktoriId(Long doktoriId) {
        this.doktoriId = doktoriId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public String getEmriMbiemri() {
        return emriMbiemri;
    }

    public void setEmriMbiemri(String emriMbiemri) {
        this.emriMbiemri = emriMbiemri;
    }
}