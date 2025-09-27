package com.example.labkursSpring.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class CreateVizitaRequest {
    private Long pacientiId;
    private Long doktoriId;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate data;

    private String pershkrimi;

    public CreateVizitaRequest() {}

    public Long getPacientiId() { return pacientiId; }
    public void setPacientiId(Long pacientiId) { this.pacientiId = pacientiId; }
    public Long getDoktoriId() { return doktoriId; }
    public void setDoktoriId(Long doktoriId) { this.doktoriId = doktoriId; }
    public LocalDate getData() { return data; }
    public void setData(LocalDate data) { this.data = data; }
    public String getPershkrimi() { return pershkrimi; }
    public void setPershkrimi(String pershkrimi) { this.pershkrimi = pershkrimi; }
}