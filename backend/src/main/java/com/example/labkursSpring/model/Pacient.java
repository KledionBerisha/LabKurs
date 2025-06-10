package com.example.labkursSpring.model;

import jakarta.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Pacienti")
public class Pacient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PacientiID")
    private Long pacientiId;

    @Column(name = "NumriPersonal", unique = true)
    private Long numriPersonal;

    @Column(name = "EmriMbiemri", nullable = false)
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
     
     @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL, orphanRemoval = true)
     private List<Alergjia> alergjite;

    @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Nderhyrje> nderhyrjet;

    @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SemundjeKronike> semundjeKronikeList;

    @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Medikamente> medikamentet;

    @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KartelaVaksinimit> kartelatVaksinimit;

    @OneToMany(mappedBy = "pacient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AnkesaAnaliza> ankesatAnalizat;

    @Column(name = "Alergji")
    private Boolean alergji;

    @Column(name = "Nderhyrje")
    private Boolean nderhyrje;

    @Column(name = "SemundjeKronike")
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

    public List<Alergjia> getAlergjite() {
        return alergjite;
    }
    public void setAlergjite(List<Alergjia> alergjite) {
        this.alergjite = alergjite;
    }

    public List<Nderhyrje> getNderhyrjet() {
        return nderhyrjet;
    }
    public void setNderhyrjet(List<Nderhyrje> nderhyrjet) {
        this.nderhyrjet = nderhyrjet;
    }

    public List<SemundjeKronike> getSemundjeKronikeList() {
        return semundjeKronikeList;
    }
    public void setSemundjeKronikeList(List<SemundjeKronike> semundjeKronikeList) {
        this.semundjeKronikeList = semundjeKronikeList;
    }

    public List<Medikamente> getMedikamentet() {
        return medikamentet;
    }
    public void setMedikamentet(List<Medikamente> medikamentet) {
        this.medikamentet = medikamentet;
    }

    public List<KartelaVaksinimit> getKartelatVaksinimit() {
        return kartelatVaksinimit;
    }
    public void setKartelatVaksinimit(List<KartelaVaksinimit> kartelatVaksinimit) {
        this.kartelatVaksinimit = kartelatVaksinimit;
    }

    public List<AnkesaAnaliza> getAnkesatAnalizat() {
        return ankesatAnalizat;
    }
    public void setAnkesatAnalizat(List<AnkesaAnaliza> ankesatAnalizat) {
        this.ankesatAnalizat = ankesatAnalizat;
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