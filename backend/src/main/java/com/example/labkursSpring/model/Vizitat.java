package com.example.labkursSpring.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Vizitat")
public class Vizitat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VizitatID")
    private Long vizitatId;

    @ManyToOne
    @JoinColumn(name = "PacientiID", nullable = false)
    private Pacient pacient;

    @ManyToOne
    @JoinColumn(name = "DoktoriID", nullable = false)
    private Doktori doktori;

    @Column(name = "Data", nullable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date data;

    @Column(name = "Pershkrimi")
    private String pershkrimi;

    // Getters and Setters
    public Long getVizitatId() {
        return vizitatId;
    }

    public void setVizitatId(Long vizitatId) {
        this.vizitatId = vizitatId;
    }

    public Pacient getPacient() {
        return pacient;
    }

    public void setPacient(Pacient pacient) {
        this.pacient = pacient;
    }

    public Doktori getDoktori() {
        return doktori;
    }

    public void setDoktori(Doktori doktori) {
        this.doktori = doktori;
    }

    public Date getData() {
        return data;
    }

    public void setData(Date data) {
        this.data = data;
    }

    public String getPershkrimi() {
        return pershkrimi;
    }

    public void setPershkrimi(String pershkrimi) {
        this.pershkrimi = pershkrimi;
    }
}