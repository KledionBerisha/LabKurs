package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Nderhyrje;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.NderhyrjeRepo;
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
@RequestMapping("/api/nderhyrje")
public class NderhyrjeController {

    @Autowired
    private NderhyrjeRepo repo;

    @Autowired
    private PacientRepo pacientRepo;

    private Long extractPacientiId(Map<String, Object> payload) {
        Object idObj = payload.getOrDefault("pacientiId", payload.get("pacientiID"));
        if (idObj == null) return null;
        if (idObj instanceof Number) return ((Number) idObj).longValue();
        try { return Long.valueOf(idObj.toString()); } catch (Exception e) { return null; }
    }

    @PostMapping
    public Nderhyrje create(@RequestBody Map<String, Object> payload) {
        Long pacientiId = extractPacientiId(payload);
        String pershkrimi = payload.get("pershkrimi") == null ? null : payload.get("pershkrimi").toString();

        if (pacientiId == null || pershkrimi == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "pacientiId and pershkrimi required");
        }

        Pacient pacient = pacientRepo.findById(pacientiId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacient not found"));

        Nderhyrje n = new Nderhyrje();
        n.setPacient(pacient);
        n.setPershkrimi(pershkrimi);
        return repo.save(n);
    }

    @GetMapping("/pacienti/{id}")
    public List<Nderhyrje> listByPacient(@PathVariable Long id) {
        return repo.findByPacient_PacientiId(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Nderhyrje> update(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
    Nderhyrje existing = repo.findById(id)
    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Nderhyrje not found"));

    if (payload.containsKey("pershkrimi")) {
        String pershkrimi = (payload.get("pershkrimi") == null ? "" : payload.get("pershkrimi").toString());

    if (pershkrimi.isBlank()) {
        repo.delete(existing);
        return ResponseEntity.noContent().build();
    } else {
        existing.setPershkrimi(pershkrimi);
    }
    }

    Long newPacientiId = extractPacientiId(payload);
    if (newPacientiId != null) {
        Pacient p = pacientRepo.findById(newPacientiId)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pacient not found"));
        existing.setPacient(p);
    }

    Nderhyrje saved = repo.save(existing);
    return ResponseEntity.ok(saved);
}

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
    if (!repo.existsById(id)) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nderhyrje not found");
    }
    repo.deleteById(id);
    return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/pacienti/{pacientId}")
    public ResponseEntity<Void> deleteByPacient(@PathVariable Long pacientId) {
        List<Nderhyrje> list = repo.findByPacient_PacientiId(pacientId);
        repo.deleteAll(list);
        return ResponseEntity.noContent().build();
    }
}