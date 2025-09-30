package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Fabrika;
import com.example.labkursSpring.repository.FabrikaRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/fabrika")
public class FabrikaController {

    private final FabrikaRepo repo;

    public FabrikaController(FabrikaRepo repo){
        this.repo=repo;
    }

    @GetMapping
    public List<Fabrika> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Fabrika create(@RequestBody Fabrika f) {
        return repo.save(f);
    }

    @PutMapping("/{id}")
    public Fabrika update(@PathVariable Long id, @RequestBody Fabrika f) {
        f.setFabrikaID(id);
        return repo.save(f);
    }

    @DeleteMapping("/{id}")
    public void Delete(@PathVariable Long id) {
        repo.findById(id).ifPresent(repo::delete);
    }
}