package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Alergjia")
public class Alergjia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AlergjiaID")
    private Long alergjiaId;

    @ManyToOne
    @JoinColumn(name = "PacientiID", nullable = false)
    private Pacient pacient;

    @Column(name = "Pershkrimi", nullable = false)
    private String pershkrimi;

    //getters and setters
    public Long getAlergjiaId() {
        return alergjiaId;
    }
    public void setAlergjiaId(Long alergjiaId) {
        this.alergjiaId = alergjiaId;
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