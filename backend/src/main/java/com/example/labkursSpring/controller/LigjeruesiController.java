package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Ligjeruesi;
import com.example.labkursSpring.repository.LigjeruesiRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/ligjeruesi")
public class LigjeruesiController {

    private final LigjeruesiRepo repo;

    public LigjeruesiController(LigjeruesiRepo repo){ this.repo=repo; }

    @GetMapping
    public List<Ligjeruesi> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Ligjeruesi create(@RequestBody Ligjeruesi l) {
        return repo.save(l);
    }

    @PutMapping("/{id}")
    public Ligjeruesi update(@PathVariable Long id, @RequestBody Ligjeruesi l) {
        l.setLecturerID(id);
        return repo.save(l);
    }

    @DeleteMapping("/{id}")
    public void Delete(@PathVariable Long id) {
        repo.findById(id).ifPresent(repo::delete);
    }
}