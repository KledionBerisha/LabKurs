package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Nderhyrje")
public class Nderhyrje {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "NderhyrjeID")
    private Long nderhyrjeId;

    @ManyToOne
    @JoinColumn(name = "PacientiID", nullable = false)
    private Pacient pacient;

    @Column(name = "Pershkrimi", nullable = false)
    private String pershkrimi;

    //getters and setters
    public Long getNderhyrjeId() {
        return nderhyrjeId;
    }
    public void setNderhyrjeId(Long nderhyrjeId) {
        this.nderhyrjeId = nderhyrjeId;
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