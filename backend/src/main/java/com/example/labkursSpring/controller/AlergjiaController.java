package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Alergjia;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.AlergjiaRepo;
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
@RequestMapping("/api/alergjia")
public class AlergjiaController {

    @Autowired
    private AlergjiaRepo alergjiaRepo;

    @Autowired
    private PacientRepo pacientRepo;

    private Long extractPacientiId(Map<String, Object> payload) {
        Object idObj = payload.getOrDefault("pacientiId", payload.get("pacientiID"));
        if (idObj == null) return null;
        if (idObj instanceof Number) return ((Number) idObj).longValue();
        try { return Long.valueOf(idObj.toString()); } catch (Exception e) { return null; }
    }

    @PostMapping
    public Alergjia create(@RequestBody Map<String, Object> payload) {
        Long pacientiId = extractPacientiId(payload);
        String pershkrimi = payload.get("pershkrimi") == null ? null : payload.get("pershkrimi").toString();

        if (pacientiId == null || pershkrimi == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pacientiId and pershkrimi required");
        }

        Pacient pacient = pacientRepo.findById(pacientiId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacient not found"));

        Alergjia a = new Alergjia();
        a.setPacient(pacient);
        a.setPershkrimi(pershkrimi);
        return alergjiaRepo.save(a);
    }

    @GetMapping("/pacienti/{id}")
    public List<Alergjia> listByPacient(@PathVariable Long id) {
        return alergjiaRepo.findByPacient_PacientiId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alergjia> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Alergjia existing = alergjiaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alergjia not found"));

        // Check if we should delete the allergy record (empty description)
        if (payload.containsKey("pershkrimi")) {
            String pershkrimi = (payload.get("pershkrimi") == null ? "" : payload.get("pershkrimi").toString());
            
            if(pershkrimi.isBlank()) {
                // Delete the allergy record if description is empty
                alergjiaRepo.delete(existing);
                return ResponseEntity.noContent().build();
            }
            else {
                existing.setPershkrimi(pershkrimi);
            }
        }

        // optionally update pacient reference if provided
        Long newPacientiId = extractPacientiId(payload);
        if (newPacientiId != null) {
            Pacient p = pacientRepo.findById(newPacientiId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacient not found"));
            existing.setPacient(p);
        }

        Alergjia saved = alergjiaRepo.save(existing);
        return ResponseEntity.ok(saved);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!alergjiaRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Alergjia not found");
        }
        alergjiaRepo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
    
    @DeleteMapping("/pacienti/{pacientId}")
    public ResponseEntity<Void> deleteByPacient(@PathVariable Long pacientId) {
        List<Alergjia> alergjite = alergjiaRepo.findByPacient_PacientiId(pacientId);
        alergjiaRepo.deleteAll(alergjite);
        return ResponseEntity.noContent().build();
    }
}