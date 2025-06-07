package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vendbanimi")
public class Vendbanimi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VendbanimiID")
    private Long vendbanimiId;

    @Column(name = "Emri", nullable = false)
    private String emri;

    // Getters and Setters
    public Long getVendbanimiId() {
        return vendbanimiId;
    }

    public void setVendbanimiId(Long vendbanimiId) {
        this.vendbanimiId = vendbanimiId;
    }

    public String getEmri() {
        return emri;
    }

    public void setEmri(String emri) {
        this.emri = emri;
    }
}