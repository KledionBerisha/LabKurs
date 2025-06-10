package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "KartelaVaksinimit")
public class KartelaVaksinimit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "KartelaVaksinimitID")
    private Long kartelaVaksinimitId;

    @ManyToOne
    @JoinColumn(name = "PacientiID", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Pacient pacient;

    @Column(name = "Pershkrimi", nullable = false)
    private String pershkrimi;

    //getters and setters
    public Long getKartelaVaksinimitId() {
        return kartelaVaksinimitId;
    }
    public void setKartelaVaksinimitId(Long kartelaVaksinimitId) {
        this.kartelaVaksinimitId = kartelaVaksinimitId;
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