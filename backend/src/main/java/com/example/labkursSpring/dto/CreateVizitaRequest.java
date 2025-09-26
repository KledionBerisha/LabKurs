package com.example.labkursSpring.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class CreateVizitaRequest {
    private Long pacientiId;
    private Long doktoriId;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime data;

    private String pershkrimi;

    public CreateVizitaRequest() {}

    public Long getPacientiId() { return pacientiId; }
    public void setPacientiId(Long pacientiId) { this.pacientiId = pacientiId; }
    public Long getDoktoriId() { return doktoriId; }
    public void setDoktoriId(Long doktoriId) { this.doktoriId = doktoriId; }
    public LocalDateTime getData() { return data; }
    public void setData(LocalDateTime data) { this.data = data; }
    public String getPershkrimi() { return pershkrimi; }
    public void setPershkrimi(String pershkrimi) { this.pershkrimi = pershkrimi; }
}