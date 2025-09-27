
package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "doktori")
public class Doktori {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "DoktoriID")
    private Long doktoriId;

    @Column(name = "Username")
    private String username;

    @Column(name = "Password")
    private String password;

    @Column(name = "EmriMbiemri")
    private String emriMbiemri;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID")
    private Users user;

    public Long getDoktoriId() { return doktoriId; }
    public void setDoktoriId(Long doktoriId) { this.doktoriId = doktoriId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmriMbiemri() { return emriMbiemri; }
    public void setEmriMbiemri(String emriMbiemri) { this.emriMbiemri = emriMbiemri; }
    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }
}