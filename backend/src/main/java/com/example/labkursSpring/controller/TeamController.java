package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Team;
import com.example.labkursSpring.repository.TeamRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/team")
public class TeamController {

    private final TeamRepo repo;

    public TeamController(TeamRepo repo) { this.repo=repo;}

    @GetMapping
    public List<Team> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Team create(@RequestBody Team t) {
        return repo.save(t);
    }

    @PutMapping("/{id}")
    public Team update(@PathVariable Long id, @RequestBody Team t) {
        t.setTeamID(id);
        return repo.save(t);
    }

    @DeleteMapping("/{id}")
    public void Delete(@PathVariable Long id) {
        repo.findById(id).ifPresent(repo::delete);
    }
}