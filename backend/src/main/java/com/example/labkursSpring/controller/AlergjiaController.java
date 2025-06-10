package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Alergjia;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.AlergjiaRepo;
import com.example.labkursSpring.repository.PacientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/alergjia")
public class AlergjiaController {
    @Autowired
    private AlergjiaRepo alergjiaRepo;

    @Autowired
    private PacientRepo pacientRepo;

    @PostMapping
    public Alergjia addAlergjia(@RequestBody Map<String, Object> payload) {
        Object idObj = payload.get("pacientiID");
        Long pacientiID;
        if (idObj instanceof Integer) {
            pacientiID = ((Integer) idObj).longValue();
        } else {
            pacientiID = Long.valueOf(idObj.toString());
        }
        String pershkrimi = payload.get("pershkrimi").toString();
        Pacient pacient = pacientRepo.findById(pacientiID).orElseThrow();
        Alergjia alergjia = new Alergjia();
        alergjia.setPacient(pacient);
        alergjia.setPershkrimi(pershkrimi);
        return alergjiaRepo.save(alergjia);
    }

    @GetMapping("/pacienti/{id}")
    public List<Alergjia> getAlergjiaByPacientId(@PathVariable Long id) {
        return alergjiaRepo.findByPacient_PacientiId(id);
    }
}