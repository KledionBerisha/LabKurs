package com.example.labkursSpring.model;

import jakarta.persistence.*;

@Entity
@Table(name = "AnkesaAnaliza")
public class AnkesaAnaliza {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "AnkesaAnalizaID")
    private Long ankesaAnalizaId;

    @ManyToOne
    @JoinColumn(name = "PacientiID", nullable = false)
    private Pacient pacient;

    @Column(name = "Pershkrimi", nullable = false)
    private String pershkrimi;

    //getters and setters
    public Long getAnkesaAnalizaId() {
        return ankesaAnalizaId;
    }
    public void setAnkesaAnalizaId(Long ankesaAnalizaId) {
        this.ankesaAnalizaId = ankesaAnalizaId;
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