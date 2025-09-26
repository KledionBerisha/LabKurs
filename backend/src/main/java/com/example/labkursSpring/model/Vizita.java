package com.example.labkursSpring.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "Vizitat")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Vizita {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long vizitatID;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PacientiID")
    private Pacient pacienti; // use Pacient (your model) not Pacienti

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DoktoriID")
    private Doktori doktori;

    @Column(name = "Data")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime data;

    @Column(name = "Pershkrimi", length = 1000)
    private String pershkrimi;

    public Vizita() {}

    public Long getVizitatID() { return vizitatID; }
    public void setVizitatID(Long vizitatID) { this.vizitatID = vizitatID; }

    public Pacient getPacienti() { return pacienti; }
    public void setPacienti(Pacient pacienti) { this.pacienti = pacienti; }

    public Doktori getDoktori() { return doktori; }
    public void setDoktori(Doktori doktori) { this.doktori = doktori; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public String getPershkrimi() { return pershkrimi; }
    public void setPershkrimi(String pershkrimi) { this.pershkrimi = pershkrimi; }
}