package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Ligjerata;
import com.example.labkursSpring.repository.LigjerataRepo;
import com.example.labkursSpring.model.Ligjeruesi;
import com.example.labkursSpring.repository.LigjeruesiRepo;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/ligjerata")
public class LigjerataController {

    private final LigjerataRepo ligjerataRepo;
    private final LigjeruesiRepo ligjeruesiRepo;

    public LigjerataController(LigjerataRepo ligjerataRepo, LigjeruesiRepo ligjeruesiRepo){
        this.ligjerataRepo=ligjerataRepo;
        this.ligjeruesiRepo=ligjeruesiRepo;
    }

    @GetMapping
    public List<Ligjerata> getAll() {
        return ligjerataRepo.findAll();
    }

    @GetMapping("/byLigjeruesi/{LecturerID}")
    public List<Ligjerata> byLigjeruesi(@PathVariable Long LecturerID){
        return ligjerataRepo.findByLigjerues_LecturerID(LecturerID);
    }

    @PostMapping
    public Ligjerata create(@RequestBody Map<String, Object> body){
        String name = (String) body.get("name");
        Number pid = (Number) body.get("LecturerID");
        Ligjerata l = new Ligjerata();
        l.setLectureName(name);
        if(pid != null){
            ligjeruesiRepo.findById(pid.longValue()).ifPresent(l::setLigjerues);
        }
        return ligjerataRepo.save(l);
    }

    @PutMapping("/{id}")
    public Ligjerata update(@PathVariable Long id, @RequestBody Map<String, Object> body){
        return ligjerataRepo.findById(id).map(existing -> {
            if(body.containsKey("name")) existing.setLectureName((String) body.get("name"));
            if(body.containsKey("LecturerID")){
                Number pid = (Number) body.get("LecturerID");
                if (pid != null) ligjeruesiRepo.findById(pid.longValue()).ifPresent(existing::setLigjerues);
            }
            return  ligjerataRepo.save(existing);
        }).orElseGet(() -> {
            Ligjerata l = new Ligjerata();
            l.setLectureID(id);
            l.setLectureName((String) body.get("name"));
            Number pid = (Number) body.get("LecturerID");
            if (pid != null) ligjeruesiRepo.findById(pid.longValue()).ifPresent(l::setLigjerues);
            return ligjerataRepo.save(l);
        });
    }

    @DeleteMapping("/{id}")
    public void Delete(@PathVariable Long id){
        ligjerataRepo.findById(id).ifPresent(ligjerataRepo::delete);
    }
}