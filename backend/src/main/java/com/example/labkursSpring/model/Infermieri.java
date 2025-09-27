package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "infermieri")
public class Infermieri {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "InfermieriID")
    private Long infermieriID;

    @Column(name = "Username", nullable = false)
    private String username;

    @Column(name = "Password", nullable = false)
    private String password;

    @Column(name = "EmriMbiemri")
    private String emriMbiemri;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    private Users user;

    public Long getInfermieriID() { return infermieriID; }
    public void setInfermieriID(Long infermieriID) { this.infermieriID = infermieriID; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmriMbiemri() { return emriMbiemri; }
    public void setEmriMbiemri(String emriMbiemri) { this.emriMbiemri = emriMbiemri; }
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
}