package com.example.labkursSpring.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
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
    private Pacienti pacienti;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "DoktoriID")
    private Doktori doktori;

    @Column(name = "data")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime data;

    @Column(columnDefinition = "TEXT")
    private String pershkrimi;

    public Long getVizitatID() { return vizitatID; }
    public void setVizitatID(Long vizitatID) { this.vizitatID = vizitatID; }

    public Pacienti getPacienti() { return pacienti; }
    public void setPacienti(Pacienti pacienti) { this.pacienti = pacienti; }

    public Doktori getDoktori() { return doktori; }
    public void setDoktori(Doktori doktori) { this.doktori = doktori; }

    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }

    public String getPershkrimi() { return pershkrimi; }
    public void setPershkrimi(String pershkrimi) { this.pershkrimi = pershkrimi; }
}