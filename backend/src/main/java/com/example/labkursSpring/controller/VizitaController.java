package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Doktori;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.model.Vizita;
import com.example.labkursSpring.repository.DoktoriRepo;
import com.example.labkursSpring.repository.PacientiRepo;
import com.example.labkursSpring.repository.VizitaRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api")
public class VizitaController {

    private final VizitaRepo vizitaRepo;
    private final PacientiRepo pacientRepo;
    private final DoktoriRepo doktoriRepo;

    public VizitaController(VizitaRepo vizitaRepo, PacientiRepo pacientRepo, DoktoriRepo doktoriRepo) {
        this.vizitaRepo = vizitaRepo;
        this.pacientRepo = pacientRepo;
        this.doktoriRepo = doktoriRepo;
    }

    @GetMapping("/vizitat/pacienti/{id}")
    public ResponseEntity<List<Vizita>> getAllByPacient(@PathVariable Long id) {
        List<Vizita> list = vizitaRepo.findByPacientiPacientiIDOrderByDataDesc(id);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/vizita/fundit/pacienti/{id}")
    public ResponseEntity<Vizita> getLastByPacient(@PathVariable Long id) {
        return vizitaRepo.findFirstByPacientiPacientiIDOrderByDataDesc(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/vizitat")
    public ResponseEntity<?> createVizita(@RequestBody CreateVizitaRequest req) {
        Pacient p = pacientRepo.findById(req.getPacientiId()).orElse(null);
        Doktori d = doktoriRepo.findById(req.getDoktoriId()).orElse(null);

        if (p == null || d == null) {
            return ResponseEntity.badRequest().body("Pacienti ose Doktori nuk u gjet");
        }

        Vizita v = new Vizita();
        v.setPacienti(p);
        v.setDoktori(d);
        v.setPershkrimi(req.getPershkrimi());
        v.setData(req.getData() != null ? req.getData() : LocalDateTime.now());

        Vizita saved = vizitaRepo.save(v);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/doktori")
    public ResponseEntity<List<Doktori>> listDoctors() {
        return ResponseEntity.ok(doktoriRepo.findAll());
    }

    public static class CreateVizitaRequest {
        private Long pacientiId;
        private Long doktoriId;
        private LocalDateTime data;
        private String pershkrimi;

        public Long getPacientiId() { return pacientiId; }
        public void setPacientiId(Long pacientiId) { this.pacientiId = pacientiId; }

        public Long getDoktoriId() { return doktoriId; }
        public void setDoktoriId(Long doktoriId) { this.doktoriId = doktoriId; }

        public LocalDateTime getData() { return data; }
        public void setData(LocalDateTime data) { this.data = data; }

        public String getPershkrimi() { return pershkrimi; }
        public void setPershkrimi(String pershkrimi) { this.pershkrimi = pershkrimi; }
    }
}