package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Medikamente;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.MedikamenteRepo;
import com.example.labkursSpring.repository.PacientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/medikamente")
@CrossOrigin(origins = "*")
public class MedikamenteController {
    @Autowired
    private MedikamenteRepo medikamenteRepo;

    @Autowired
    private PacientRepo pacientRepo;

    @PostMapping
    public Medikamente addMedikamente(@RequestBody Map<String, Object> payload) {
        Object idObj = payload.get("pacientiID");
        Long pacientiID;
        if (idObj instanceof Integer) {
            pacientiID = ((Integer) idObj).longValue();
        } else {
            pacientiID = Long.valueOf(idObj.toString());
        }
        String pershkrimi = payload.get("pershkrimi").toString();
        Pacient pacient = pacientRepo.findById(pacientiID).orElseThrow();
        Medikamente medikamente = new Medikamente();
        medikamente.setPacient(pacient);
        medikamente.setPershkrimi(pershkrimi);
        return medikamenteRepo.save(medikamente);
    }
}