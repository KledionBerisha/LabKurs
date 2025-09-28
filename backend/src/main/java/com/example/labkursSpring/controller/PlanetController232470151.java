package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Planet232470151;
import com.example.labkursSpring.repository.PlanetRepo232470151;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/planets")
public class PlanetController232470151 {

    private final PlanetRepo232470151 repo;

    public PlanetController232470151(PlanetRepo232470151 repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Planet232470151> getAll() {
        return repo.findByIsDeletedFalse();
    }

    @PostMapping
    public Planet232470151 create(@RequestBody Planet232470151 p) {
        return repo.save(p);
    }

    @PutMapping("/{id}")
    public Planet232470151 update(@PathVariable Long id, @RequestBody Planet232470151 p) {
        p.setPlanet232470151Id(id);
        return repo.save(p);
    }

    @DeleteMapping("/{id}")
    public void softDelete(@PathVariable Long id) {
        repo.findById(id).ifPresent(pl -> {
            pl.setIsDeleted(true);
            repo.save(pl);
        });
    }
}