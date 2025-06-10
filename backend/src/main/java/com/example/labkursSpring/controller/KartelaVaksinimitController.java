package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.KartelaVaksinimit;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.KartelaVaksinimitRepo;
import com.example.labkursSpring.repository.PacientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kartelavaksinimit")
public class KartelaVaksinimitController {
    @Autowired
    private KartelaVaksinimitRepo kartelaRepo;

    @Autowired
    private PacientRepo pacientRepo;

    @PostMapping
    public KartelaVaksinimit addKartela(@RequestBody Map<String, Object> payload) {
        Object idObj = payload.get("pacientiID");
        Long pacientiID;
        if (idObj instanceof Integer) {
            pacientiID = ((Integer) idObj).longValue();
        } else {
            pacientiID = Long.valueOf(idObj.toString());
        }
        String pershkrimi = payload.get("pershkrimi").toString();
        Pacient pacient = pacientRepo.findById(pacientiID).orElseThrow();
        KartelaVaksinimit kartela = new KartelaVaksinimit();
        kartela.setPacient(pacient);
        kartela.setPershkrimi(pershkrimi);
        return kartelaRepo.save(kartela);
    }

    @GetMapping("/pacienti/{id}")
    public List<KartelaVaksinimit> getKartelaByPacientId(@PathVariable Long id) {
        return kartelaRepo.findByPacient_PacientiId(id);
    }
}