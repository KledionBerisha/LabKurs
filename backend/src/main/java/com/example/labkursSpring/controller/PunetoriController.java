package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Fabrika;
import com.example.labkursSpring.model.Punetori;
import com.example.labkursSpring.repository.FabrikaRepo;
import com.example.labkursSpring.repository.PunetoriRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/punetori")
public class PunetoriController {

    private final FabrikaRepo fabrikaRepo;
    private final PunetoriRepo punetoriRepo;

    public PunetoriController(FabrikaRepo fabrikaRepo, PunetoriRepo punetoriRepo){
        this.fabrikaRepo=fabrikaRepo;
        this.punetoriRepo=punetoriRepo;
    }

    @GetMapping
    public List<Punetori> getAll() {
        return punetoriRepo.findAll();
    }

    @GetMapping("/byFabrika/{FabrikaID}")
    public List<Punetori> byFabrika(@PathVariable Long FabrikaID){
        return punetoriRepo.findByFabrika_fabrikaID(FabrikaID);
    }

    @PostMapping
    public Punetori create(@RequestBody Map<String, Object> body){
        String emri = (String) body.get("Emri");
        String mbiemri = (String) body.get("Mbiemri");
        String pozita = (String) body.get("Pozita");
        Long fabrikaID = toLong(body.get("ID_Fabrika"));
        Punetori p = new Punetori();
        p.setEmri(emri);
        p.setMbiemri(mbiemri);
        p.setPozita(pozita);
        if(fabrikaID != null){
            fabrikaRepo.findById(fabrikaID).ifPresent(p::setFabrika);
        }
        return punetoriRepo.save(p);
    }

    @PutMapping("/{id}")
    public Punetori update(@PathVariable Long id, @RequestBody Map<String, Object> body){
        return punetoriRepo.findById(id).map(existing -> {
            if(body.containsKey("Emri")) {
                existing.setEmri((String) body.get("Emri"));
            }
            if(body.containsKey("Mbiemri")) {
                existing.setMbiemri((String)body.get("Mbiemri"));
            }
            if(body.containsKey("Pozita")) {
                existing.setPozita((String)body.get("Pozita"));
            }
            if(body.containsKey("ID_Fabrika")) {
                Long fabrikaID = toLong(body.get("ID_Fabrika"));
                if(fabrikaID == null) {
                    existing.setFabrika(null);
                } else {
                    fabrikaRepo.findById(fabrikaID).ifPresent(existing::setFabrika);
                }
            }
            return  punetoriRepo.save(existing);
        }).orElseGet(() -> {
            Punetori p = new Punetori();
            p.setPunetoriID(id);
            p.setEmri((String) body.get("Name"));
            p.setMbiemri((String)body.get("Mbiemri"));
            p.setPozita((String)body.get("Pozita"));
            Long fabrikaID = toLong(body.get("ID_Fabrika"));
            if(fabrikaID != null) fabrikaRepo.findById(fabrikaID).ifPresent(p::setFabrika);
            return punetoriRepo.save(p);
        });
    }

    @DeleteMapping("/{id}")
    public void Delete(@PathVariable Long id){
        punetoriRepo.findById(id).ifPresent(punetoriRepo::delete);
    }

    private Long toLong(Object val){
        if(val == null) return null;
        if(val instanceof Number) return ((Number) val).longValue();
        try {
            return Long.parseLong(val.toString());
        } catch(Exception e){
            return null;
        }
    }
}