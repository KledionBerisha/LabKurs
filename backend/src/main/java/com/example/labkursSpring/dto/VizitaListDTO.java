package com.example.labkursSpring.dto;

import java.time.LocalDate;

public class VizitaListDTO {
    private Long id;
    private LocalDate data;
    private String pershkrimi;
    private String doktori;

    public VizitaListDTO(Long id, LocalDate data, String pershkrimi, String doktori) {
        this.id = id;
        this.data = data;
        this.pershkrimi = pershkrimi;
        this.doktori = doktori;
    }
    public Long getId() { return id; }
    public LocalDate getData() { return data; }
    public String getPershkrimi() { return pershkrimi; }
    public String getDoktori() { return doktori; }
}