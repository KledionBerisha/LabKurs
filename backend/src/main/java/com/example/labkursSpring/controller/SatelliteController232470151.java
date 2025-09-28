package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Satellite232470151;
import com.example.labkursSpring.model.Planet232470151;
import com.example.labkursSpring.repository.PlanetRepo232470151;
import com.example.labkursSpring.repository.SatelliteRepo232470151;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/satellites")
public class SatelliteController232470151 {

    private final SatelliteRepo232470151 satRepo;
    private final PlanetRepo232470151 planetRepo;
    public SatelliteController232470151(SatelliteRepo232470151 satRepo, PlanetRepo232470151 planetRepo) {
        this.satRepo=satRepo;
        this.planetRepo=planetRepo;
    }

    @GetMapping
    public List<Satellite232470151> getAll() {
        return satRepo.findByIsDeletedFalse();
    }

    @GetMapping("/byPlanet/{planetId}")
    public List<Satellite232470151> byPlanet(@PathVariable Long planetId){
        return satRepo.findByPlanetPlanet232470151IdAndIsDeletedFalse(planetId);
    }

    @PostMapping
    public Satellite232470151 create(@RequestBody Map<String, Object> body){
        String name = (String) body.get("name");
        Number pid = (Number) body.get("planetId");
        Satellite232470151 s = new Satellite232470151();
        s.setName(name);
        if(pid != null){
            planetRepo.findById(pid.longValue()).ifPresent(s::setPlanet);
        }
        return satRepo.save(s);
    }

    @PutMapping("/{id}")
    public Satellite232470151 update(@PathVariable Long id, @RequestBody Map<String, Object> body){
        return satRepo.findById(id).map(existing -> {
            if(body.containsKey("name")) existing.setName((String) body.get("name"));
            if(body.containsKey("planetId")){
                Number pid = (Number) body.get("planetId");
                if (pid != null) planetRepo.findById(pid.longValue()).ifPresent(existing::setPlanet);
            }
            return satRepo.save(existing);
        }).orElseGet(() -> {
            Satellite232470151 s = new Satellite232470151();
            s.setSatellite232470151Id(id);
            s.setName((String) body.get("name"));
            Number pid = (Number) body.get("planetId");
            if (pid != null) planetRepo.findById(pid.longValue()).ifPresent(s::setPlanet);
            return satRepo.save(s);
        });
    }

    @DeleteMapping("/{id}")
    public void softDelete(@PathVariable Long id){
        satRepo.findById(id).ifPresent(s -> { 
            s.setIsDeleted(true);
            satRepo.save(s);
        });
    }

}