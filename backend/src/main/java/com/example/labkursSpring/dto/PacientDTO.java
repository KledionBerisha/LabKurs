package com.example.labkursSpring.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.Date;

public class PacientDTO {
    @NotBlank(message = "Emri dhe mbiemri janë të detyrueshëm")
    private String emriMbiemri;

    @NotNull(message = "Numri personal është i detyrueshëm")
    private Long numriPersonal;

    @NotNull(message = "Ditelindja është e detyrueshme")
    private Date ditelindja;

    @NotNull(message = "Vendbanimi është i detyrueshëm")
    private Long vendbanimiID;

    @NotBlank(message = "Gjinia është e detyrueshme")
    private String gjinia;

    @NotNull(message = "Sigurimi shendetsor është i detyrueshëm")
    private Boolean sigurimShendetsor;

    @NotNull(message = "Alergjia është e detyrueshme")
    private Boolean alergji;

    @NotNull(message = "Nderhyrja është e detyrueshme")
    private Boolean nderhyrje;

    @NotNull(message = "Semundja kronike është e detyrueshme")
    private Boolean semundjeKronike;

    // Getters and Setters
    public String getEmriMbiemri() { return emriMbiemri; }
    public void setEmriMbiemri(String emriMbiemri) { this.emriMbiemri = emriMbiemri; }

    public Long getNumriPersonal() { return numriPersonal; }
    public void setNumriPersonal(Long numriPersonal) { this.numriPersonal = numriPersonal; }

    public Date getDitelindja() { return ditelindja; }
    public void setDitelindja(Date ditelindja) { this.ditelindja = ditelindja; }

    public Long getVendbanimiID() { return vendbanimiID; }
    public void setVendbanimiID(Long vendbanimiID) { this.vendbanimiID = vendbanimiID; }

    public String getGjinia() { return gjinia; }
    public void setGjinia(String gjinia) { this.gjinia = gjinia; }

    public Boolean getSigurimShendetsor() { return sigurimShendetsor; }
    public void setSigurimShendetsor(Boolean sigurimShendetsor) { this.sigurimShendetsor = sigurimShendetsor; }

    public Boolean getAlergji() { return alergji; }
    public void setAlergji(Boolean alergji) { this.alergji = alergji; }

    public Boolean getNderhyrje() { return nderhyrje; }
    public void setNderhyrje(Boolean nderhyrje) { this.nderhyrje = nderhyrje; }

    public Boolean getSemundjeKronike() { return semundjeKronike; }
    public void setSemundjeKronike(Boolean semundjeKronike) { this.semundjeKronike = semundjeKronike; }
}