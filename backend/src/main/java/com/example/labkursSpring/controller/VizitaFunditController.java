package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.VizitaFunditView;
import com.example.labkursSpring.repository.VizitaFunditViewRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vizita-fundit")
@CrossOrigin(origins = "http://localhost:3000")
public class VizitaFunditController {

    private final VizitaFunditViewRepo repo;

    public VizitaFunditController(VizitaFunditViewRepo repo) {
        this.repo = repo;
    }

    @GetMapping("/pacienti/{id}")
    public ResponseEntity<VizitaFunditView> getLastByPatient(@PathVariable Long id) {
        return repo.findByPacientiId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}