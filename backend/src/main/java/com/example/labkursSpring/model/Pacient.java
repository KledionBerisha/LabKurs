package com.example.labkursSpring.model;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "Pacienti")
public class Pacient{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PacientiID")
    private Long pacientiId;

    @Column(name = "NumriPersonal", nullable = false, unique = true)
    private Long numriPersonal;
    
    @Column(name = "EmriMbiemri",nullable = false)
    private String emriMbiemri;

    @Column(name = "Ditelindja", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date ditelindja;

    @ManyToOne
    @JoinColumn(name = "VendbanimiID", nullable = false)
    private Vendbanimi vendbanimi;

    @Column(name = "Gjinia", nullable = false)
    private String gjinia;

    @Column(name = "SigurimShendetsor", nullable = false)
    private Boolean sigurimShendetsor;

    @Column(name = "Alergji", nullable = true)
    private Boolean alergji;

    @Column(name = "Nderhyrje", nullable = true)
    private Boolean nderhyrje;

    @Column(name = "SemundjeKronike", nullable = true)
    private Boolean semundjeKronike;


    // Getters and Setters
    public Long getPacientiId() { 
        return pacientiId; 
    }
    public void setPacientiId(Long pacientiId) { 
        this.pacientiId = pacientiId; 
    }
    public Long getNumriPersonal() { 
        return numriPersonal; 
    }
    public void setNumriPersonal(Long numriPersonal) { 
        this.numriPersonal = numriPersonal; 
    }


    public String getEmriMbiemri() {
         return emriMbiemri; 
    }
    public void setEmriMbiemri(String emriMbiemri) {
         this.emriMbiemri = emriMbiemri; 
    }


    public Date getDitelindja() {
         return ditelindja; 
    }
    public void setDitelindja(Date ditelindja) {
         this.ditelindja = ditelindja; 
    }


    public Vendbanimi getVendbanimi() {
         return vendbanimi; 
    }
    public void setVendbanimi(Vendbanimi id) {
         this.vendbanimi = id; 
    }


    public String getGjinia() {
         return gjinia; 
    }
    public void setGjinia(String gjinia) {
         this.gjinia = gjinia; 
    }


    public Boolean getSigurimShendetsor() {
         return sigurimShendetsor; 
    }
    public void setSigurimShendetsor(Boolean sigurimShendetsor) {
         this.sigurimShendetsor = sigurimShendetsor; 
    }


    public Boolean getAlergji() {
         return alergji; 
    }
    public void setAlergji(Boolean alergji) {
         this.alergji = alergji; 
    }


    public Boolean getNderhyrje() {
         return nderhyrje; 
    }
    public void setNderhyrje(Boolean nderhyrje) {
         this.nderhyrje = nderhyrje; 
    }


    public Boolean getSemundjeKronike() {
         return semundjeKronike; 
    }
    public void setSemundjeKronike(Boolean semundjeKronike) {
         this.semundjeKronike = semundjeKronike; 
    }

}