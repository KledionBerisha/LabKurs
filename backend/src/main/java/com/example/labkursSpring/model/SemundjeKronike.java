package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "SemundjeKronike")
public class SemundjeKronike {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SemundjeKronikeID")
    private Long semundjeKronikeId;

    @ManyToOne
    @JoinColumn(name = "PacientiID", nullable = false)
    private Pacient pacient;

    @Column(name = "Pershkrimi", nullable = false)
    private String pershkrimi;

    //getters and setters
    public Long getSemundjeKronikeId() {
        return semundjeKronikeId;
    }
    public void setSemundjeKronikeId(Long semundjeKronikeId) {
        this.semundjeKronikeId = semundjeKronikeId;
    }

    public Pacient getPacient() {
        return pacient;
    }
    public void setPacient(Pacient pacient) {
        this.pacient = pacient;
    }

    public String getPershkrimi() {
        return pershkrimi;
    }
    public void setPershkrimi(String pershkrimi) {
        this.pershkrimi = pershkrimi;
    }
}