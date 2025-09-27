package com.example.labkursSpring.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

@Entity
@Table(name = "VizitaFundit")
public class VizitaFunditView {

    @Id
    @Column(name = "VizitatID")
    private Long vizitatID;

    @Column(name = "PacientiID")
    private Long pacientiId;

    @Column(name = "PacientEmriMbiemri")
    private String pacientEmriMbiemri;

    @Column(name = "DoktoriID")
    private Long doktoriId;

    @Column(name = "DoktorEmriMbiemri")
    private String doktorEmriMbiemri;

    @Column(name = "Data")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;

    @Column(name = "Pershkrimi")
    private String pershkrimi;

    public Long getVizitatID() { return vizitatID; }
    public Long getPacientiId() { return pacientiId; }
    public String getPacientEmriMbiemri() { return pacientEmriMbiemri; }
    public Long getDoktoriId() { return doktoriId; }
    public String getDoktorEmriMbiemri() { return doktorEmriMbiemri; }
    public LocalDate getData() { return data; }
    public String getPershkrimi() { return pershkrimi; }
}