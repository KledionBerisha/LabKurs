package com.example.labkursSpring.controller;

import com.example.labkursSpring.dto.VizitaListDTO;
import com.example.labkursSpring.dto.CreateVizitaRequest;
import com.example.labkursSpring.model.Vizita;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.model.Doktori;
import com.example.labkursSpring.repository.VizitaRepo;
import com.example.labkursSpring.repository.PacientRepo;
import com.example.labkursSpring.repository.DoktoriRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/vizita")
@CrossOrigin(origins = "http://localhost:3000")
public class VizitaController {

    private final VizitaRepo vizitaRepo;
    private final PacientRepo pacientRepo;
    private final DoktoriRepo doktoriRepo;

    public VizitaController(VizitaRepo vizitaRepo, PacientRepo pacientRepo, DoktoriRepo doktoriRepo) {
        this.vizitaRepo = vizitaRepo;
        this.pacientRepo = pacientRepo;
        this.doktoriRepo = doktoriRepo;
    }

    @PostMapping
    public ResponseEntity<VizitaListDTO> create(@RequestBody CreateVizitaRequest req) {
        if (req.getPacientiId() == null || req.getDoktoriId() == null || req.getData() == null) {
            return ResponseEntity.badRequest().build();
        }
        Pacient pacient = pacientRepo.findById(req.getPacientiId()).orElse(null);
        Doktori doktori = doktoriRepo.findById(req.getDoktoriId()).orElse(null);
        if (pacient == null || doktori == null) {
            return ResponseEntity.badRequest().build();
        }
        Vizita v = new Vizita();
        v.setPacienti(pacient);
        v.setDoktori(doktori);
        v.setData(req.getData());
        v.setPershkrimi(req.getPershkrimi());
        v = vizitaRepo.save(v);
        VizitaListDTO dto = new VizitaListDTO(
                v.getVizitatID(),
                v.getData(),
                v.getPershkrimi(),
                v.getDoktori() != null ? v.getDoktori().getEmriMbiemri() : null
        );
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/pacienti/{id}")
    public List<VizitaListDTO> listByPacient(@PathVariable Long id) {
        return vizitaRepo.findByPacienti_PacientiIdOrderByDataDesc(id)
                .stream()
                .map(v -> new VizitaListDTO(
                        v.getVizitatID(),
                        v.getData(),
                        v.getPershkrimi(),
                        v.getDoktori() != null ? v.getDoktori().getEmriMbiemri() : null
                ))
                .collect(Collectors.toList());
    }

    @GetMapping("/fundit/pacienti/{id}")
    public ResponseEntity<VizitaListDTO> lastByPacient(@PathVariable Long id) {
        Vizita v = vizitaRepo.findFirstByPacienti_PacientiIdOrderByDataDesc(id);
        if (v == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(new VizitaListDTO(
                v.getVizitatID(),
                v.getData(),
                v.getPershkrimi(),
                v.getDoktori() != null ? v.getDoktori().getEmriMbiemri() : null
        ));
    }

    @GetMapping("/{vizitaId}")
    public ResponseEntity<VizitaListDTO> getOne(@PathVariable Long vizitaId) {
        return vizitaRepo.findById(vizitaId)
                .map(v -> ResponseEntity.ok(new VizitaListDTO(
                        v.getVizitatID(),
                        v.getData(),
                        v.getPershkrimi(),
                        v.getDoktori() != null ? v.getDoktori().getEmriMbiemri() : null
                )))
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{vizitaId}")
    @Transactional
    public ResponseEntity<Void> delete(@PathVariable Long vizitaId) {
        var opt = vizitaRepo.findById(vizitaId);
        if (opt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        vizitaRepo.delete(opt.get());
        return ResponseEntity.noContent().build();
    }
}