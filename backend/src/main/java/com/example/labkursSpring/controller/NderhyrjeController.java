package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Nderhyrje;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.NderhyrjeRepo;
import com.example.labkursSpring.repository.PacientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/nderhyrje")
@CrossOrigin(origins = "*")
public class NderhyrjeController {
    @Autowired
    private NderhyrjeRepo nderhyrjeRepo;

    @Autowired
    private PacientRepo pacientRepo;

    @PostMapping
    public Nderhyrje addNderhyrje(@RequestBody Map<String, Object> payload) {
        Object idObj = payload.get("pacientiID");
        Long pacientiID;
        if (idObj instanceof Integer) {
            pacientiID = ((Integer) idObj).longValue();
        } else {
            pacientiID = Long.valueOf(idObj.toString());
        }
        String pershkrimi = payload.get("pershkrimi").toString();
        Pacient pacient = pacientRepo.findById(pacientiID).orElseThrow();
        Nderhyrje nderhyrje = new Nderhyrje();
        nderhyrje.setPacient(pacient);
        nderhyrje.setPershkrimi(pershkrimi);
        return nderhyrjeRepo.save(nderhyrje);
    }
}