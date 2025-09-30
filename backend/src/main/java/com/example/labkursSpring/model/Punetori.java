package com.example.labkursSpring.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Punetori")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Punetori {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PunetoriID")
    private Long punetoriID;

    @Column(name = "Emri")
    private String emri;
    
    @Column(name = "Mbiemri")
    private String mbiemri;

    @Column(name = "Pozita")
    private String pozita;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ID_Fabrika")
    @JsonIgnoreProperties({"punetori"})
    private Fabrika fabrika;

    public Long getPunetoriID() {
        return punetoriID;
    }

    public void setPunetoriID(Long punetoriID) {
        this.punetoriID = punetoriID;
    }

    public String getEmri() {
        return emri;
    }

    public void setEmri(String emri) {
        this.emri = emri;
    }

    public String getMbiemri() {
        return mbiemri;
    }

    public void setMbiemri(String mbiemri) {
        this.mbiemri = mbiemri;
    }

    public String getPozita() {
        return pozita;
    }

    public void setPozita(String pozita) {
        this.pozita = pozita;
    }

    public Fabrika getFabrika() {
        return fabrika;
    }

    public void setFabrika(Fabrika fabrika) {
        this.fabrika = fabrika;
    }
}