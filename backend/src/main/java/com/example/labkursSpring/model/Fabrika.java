package com.example.labkursSpring.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "Fabrika")
public class Fabrika {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FabrikaID")
    private Long fabrikaID;

    @Column(name = "EmriFabrikes")
    private String emriFabrikes;

    @Column(name = "Lokacioni")
    private String lokacioni;

    @OneToMany(mappedBy = "fabrika", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Punetori> punetori;

    public List<Punetori> getPunetori() {
        return punetori;
    }

    public void setPunetori(List<Punetori> punetori) {
        this.punetori = punetori;
    }

    public Long getFabrikaID() {
        return fabrikaID;
    }

    public void setFabrikaID(Long fabrikaID) {
        this.fabrikaID = fabrikaID;
    }

    public String getEmriFabrikes() {
        return emriFabrikes;
    }

    public void setName(String emriFabrikes) {
        this.emriFabrikes = emriFabrikes;
    }

    public String getLokacioni() {
        return lokacioni;
    }

    public void setLokacioni(String lokacioni) {
        this.lokacioni = lokacioni;
    }
}