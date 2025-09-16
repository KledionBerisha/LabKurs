package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.AnkesaAnaliza;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.AnkesaAnalizaRepo;
import com.example.labkursSpring.repository.PacientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.Map;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/api/ankesaanaliza")
public class AnkesaAnalizaController {
    @Autowired
    private AnkesaAnalizaRepo ankesaAnalizaRepo;

    @Autowired
    private PacientRepo pacientRepo;

    private Long extractPacientiId(Map<String, Object> payload) {
        Object idObj = payload.getOrDefault("pacientiId", payload.get("pacientiID"));
        if (idObj == null) return null;
        if (idObj instanceof Number) return ((Number) idObj).longValue();
        try { return Long.valueOf(idObj.toString()); } catch (Exception e) { return null; }
    }

    @PostMapping
    public AnkesaAnaliza addAnkesaAnaliza(@RequestBody Map<String, Object> payload) {
        Long pacientiID = extractPacientiId(payload);
        String pershkrimi = payload.get("pershkrimi") == null ? null : payload.get("pershkrimi").toString();

        if (pacientiID == null || pershkrimi == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pacientiId and pershkrimi required");
        }

        Pacient pacient = pacientRepo.findById(pacientiID).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacient not found"));
        AnkesaAnaliza ankesaAnaliza = new AnkesaAnaliza();
        ankesaAnaliza.setPacient(pacient);
        ankesaAnaliza.setPershkrimi(pershkrimi);
        return ankesaAnalizaRepo.save(ankesaAnaliza);
    }

    @GetMapping("/pacienti/{id}")
    public List<AnkesaAnaliza> getAnkesaAnalizaByPacientId(@PathVariable Long id) {
        return ankesaAnalizaRepo.findByPacient_PacientiId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnkesaAnaliza> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        AnkesaAnaliza existing = ankesaAnalizaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "AnkesaAnaliza not found"));

        if (payload.get("pershkrimi") != null) existing.setPershkrimi(payload.get("pershkrimi").toString());

        Long newPacientiId = extractPacientiId(payload);
        if (newPacientiId != null) {
            Pacient p = pacientRepo.findById(newPacientiId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacient not found"));
            existing.setPacient(p);
        }

        return ResponseEntity.ok(ankesaAnalizaRepo.save(existing));
    }
}