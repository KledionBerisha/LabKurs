package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.model.SemundjeKronike;
import com.example.labkursSpring.repository.PacientRepo;
import com.example.labkursSpring.repository.SemundjeKronikeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/semundjekronike")
public class SemundjeKronikeController {
    @Autowired
    private SemundjeKronikeRepo semundjeKronikeRepo;

    @Autowired
    private PacientRepo pacientRepo;

    @PostMapping
    public SemundjeKronike addSemundjeKronike(@RequestBody Map<String, Object> payload) {
        Object idObj = payload.get("pacientiID");
        Long pacientiID;
        if (idObj instanceof Integer) {
            pacientiID = ((Integer) idObj).longValue();
        } else {
            pacientiID = Long.valueOf(idObj.toString());
        }
        String pershkrimi = payload.get("pershkrimi").toString();
        Pacient pacient = pacientRepo.findById(pacientiID).orElseThrow();
        SemundjeKronike semundjeKronike = new SemundjeKronike();
        semundjeKronike.setPacient(pacient);
        semundjeKronike.setPershkrimi(pershkrimi);
        return semundjeKronikeRepo.save(semundjeKronike);

    }
    @GetMapping("/pacienti/{id}")
    public List<SemundjeKronike> getSemundjeKronikeByPacientId(@PathVariable Long id) {
    return semundjeKronikeRepo.findByPacient_PacientiId(id);
    }
}