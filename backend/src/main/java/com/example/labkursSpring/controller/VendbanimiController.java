package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Vendbanimi;
import com.example.labkursSpring.service.VendbanimiService;
import com.example.labkursSpring.repository.PacientRepo;
import com.example.labkursSpring.repository.PacientRepo.PacientSummary;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/vendbanimi")
public class VendbanimiController {

    private final VendbanimiService service;
    private final PacientRepo pacientRepo;

    public VendbanimiController(VendbanimiService service, PacientRepo pacientRepo) {
        this.service = service;
        this.pacientRepo = pacientRepo;
    }

    @GetMapping
    public List<Vendbanimi> all() {
        return service.findAll();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Vendbanimi body) {
        if (body.getEmri() == null || body.getEmri().trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("error", "Emri është i detyrueshëm."));
        }
        Vendbanimi saved = service.create(body.getEmri().trim());
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        // Pre-check dependents to give detailed response (faster + clearer)
        long count = pacientRepo.countByVendbanimi_VendbanimiId(id);
        if (count > 0) {
            List<PacientSummary> deps = pacientRepo.findSummariesByVendbanimiId(id);
            return ResponseEntity.status(409)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of(
                            "error", "Nuk mund të fshihet: ekzistojnë pacientë që përdorin këtë vendbanim.",
                            "dependents", deps
                    ));
        }
        try {
            service.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalStateException ex) {
            if ("VENDBANIMI_IN_USE".equals(ex.getMessage())) {
                // Fallback if FK throws (race condition)
                List<PacientSummary> deps = pacientRepo.findSummariesByVendbanimiId(id);
                return ResponseEntity.status(409)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(Map.of(
                                "error", "Nuk mund të fshihet: ekzistojnë pacientë që përdorin këtë vendbanim.",
                                "dependents", deps
                        ));
            }
            return ResponseEntity.internalServerError()
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(Map.of("error", "Gabim i panjohur."));
        }
    }

    @GetMapping("/{id}/pacientet")
    public ResponseEntity<?> pacientetPerVendbanim(@PathVariable Long id) {
        List<PacientSummary> list = pacientRepo.findSummariesByVendbanimiId(id);
        return ResponseEntity.ok(list);
    }
}