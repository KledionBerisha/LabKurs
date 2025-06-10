package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Medikamente")
public class Medikamente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MedikamenteID")
    private Long medikamenteId;

    @ManyToOne
    @JoinColumn(name = "PacientiID", nullable = false)
    @com.fasterxml.jackson.annotation.JsonIgnore
    private Pacient pacient;

    @Column(name = "Pershkrimi", nullable = false)
    private String pershkrimi;

    //getters and setters
    public Long getMedikamenteId() {
        return medikamenteId;
    }
    public void setMedikamenteId(Long medikamenteId) {
        this.medikamenteId = medikamenteId;
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