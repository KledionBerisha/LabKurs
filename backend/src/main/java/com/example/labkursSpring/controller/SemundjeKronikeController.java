package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.SemundjeKronike;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.SemundjeKronikeRepo;
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
@RequestMapping("/api/semundjekronike")
public class SemundjeKronikeController {

    @Autowired
    private SemundjeKronikeRepo repo;

    @Autowired
    private PacientRepo pacientRepo;

    private Long extractPacientiId(Map<String, Object> payload) {
        Object idObj = payload.getOrDefault("pacientiId", payload.get("pacientiID"));
        if (idObj == null) return null;
        if (idObj instanceof Number) return ((Number) idObj).longValue();
        try { return Long.valueOf(idObj.toString()); } catch (Exception e) { return null; }
    }

    @PostMapping
    public SemundjeKronike create(@RequestBody Map<String, Object> payload) {
        Long pacientiId = extractPacientiId(payload);
        String pershkrimi = payload.get("pershkrimi") == null ? null : payload.get("pershkrimi").toString();

        if (pacientiId == null || pershkrimi == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pacientiId and pershkrimi required");
        }

        Pacient pacient = pacientRepo.findById(pacientiId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacient not found"));

        SemundjeKronike s = new SemundjeKronike();
        s.setPacient(pacient);
        s.setPershkrimi(pershkrimi);
        return repo.save(s);
    }

    @GetMapping("/pacienti/{id}")
    public List<SemundjeKronike> listByPacient(@PathVariable Long id) {
        return repo.findByPacient_PacientiId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SemundjeKronike> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        SemundjeKronike existing = repo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Semundje not found"));

        if (payload.get("pershkrimi") != null) existing.setPershkrimi(payload.get("pershkrimi").toString());

        Long newPacientiId = extractPacientiId(payload);
        if (newPacientiId != null) {
            Pacient p = pacientRepo.findById(newPacientiId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacient not found"));
            existing.setPacient(p);
        }

        return ResponseEntity.ok(repo.save(existing));
    }
}