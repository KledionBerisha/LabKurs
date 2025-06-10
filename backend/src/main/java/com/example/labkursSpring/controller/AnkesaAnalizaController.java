package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.AnkesaAnaliza;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.AnkesaAnalizaRepo;
import com.example.labkursSpring.repository.PacientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ankesaanaliza")
@CrossOrigin(origins = "*")
public class AnkesaAnalizaController {
    @Autowired
    private AnkesaAnalizaRepo ankesaAnalizaRepo;

    @Autowired
    private PacientRepo pacientRepo;

    @PostMapping
    public AnkesaAnaliza addAnkesaAnaliza(@RequestBody Map<String, Object> payload) {
        Object idObj = payload.get("pacientiID");
        Long pacientiID;
        if (idObj instanceof Integer) {
            pacientiID = ((Integer) idObj).longValue();
        } else {
            pacientiID = Long.valueOf(idObj.toString());
        }
        String pershkrimi = payload.get("pershkrimi").toString();
        Pacient pacient = pacientRepo.findById(pacientiID).orElseThrow();
        AnkesaAnaliza ankesaAnaliza = new AnkesaAnaliza();
        ankesaAnaliza.setPacient(pacient);
        ankesaAnaliza.setPershkrimi(pershkrimi);
        return ankesaAnalizaRepo.save(ankesaAnaliza);
    }
}