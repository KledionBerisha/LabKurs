package com.example.labkursSpring.controller;

import com.example.labkursSpring.dto.PacientDTO;
import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.model.Vendbanimi;
import com.example.labkursSpring.service.PacientService;
import com.example.labkursSpring.repository.VendbanimiRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pacientet")
public class PacientController {

    @Autowired
    private PacientService pacientService;

    @Autowired
    private VendbanimiRepo vendbanimiRepo;

    @PostMapping
    public ResponseEntity<?> createPacient(@RequestBody @Valid PacientDTO dto) {
        try {
            System.out.println("DTO numriPersonal: " + dto.getNumriPersonal()); // Debug log
            if (dto.getNumriPersonal() == null || dto.getNumriPersonal() <= 0) {
                return ResponseEntity.badRequest().body("Numri personal është i detyrueshëm dhe duhet të jetë më i madh se zero!");
            }
            if (dto.getEmriMbiemri() == null || dto.getEmriMbiemri().isEmpty()) {
                return ResponseEntity.badRequest().body("Emri dhe mbiemri janë të detyrueshëm!");
            }
            if (dto.getDitelindja() == null) {
                return ResponseEntity.badRequest().body("Ditelindja është e detyrueshme!");
            }
            if (dto.getVendbanimiID() == null) {
                return ResponseEntity.badRequest().body("Vendbanimi është i detyrueshëm!");
            }

            Pacient pacient = new Pacient();
            pacient.setEmriMbiemri(dto.getEmriMbiemri());
            pacient.setNumriPersonal(dto.getNumriPersonal());
            pacient.setDitelindja(dto.getDitelindja());
            pacient.setGjinia(dto.getGjinia());
            pacient.setSigurimShendetsor(dto.getSigurimShendetsor());
            pacient.setAlergji(dto.getAlergji());
            pacient.setNderhyrje(dto.getNderhyrje());
            pacient.setSemundjeKronike(dto.getSemundjeKronike());

            Vendbanimi vendbanimi = vendbanimiRepo.findById(dto.getVendbanimiID())
                .orElseThrow(() -> new IllegalArgumentException("Vendbanimi nuk u gjet!"));
            pacient.setVendbanimi(vendbanimi);

            Pacient saved = pacientService.savePacient(pacient);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Gabim gjatë krijimit të pacientit: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllPacients() {
        try {
            // Convert Pacient entities to PacientDTOs for safe serialization
            java.util.List<Pacient> pacients = pacientService.getAllPacients();
            java.util.List<PacientDTO> dtos = new java.util.ArrayList<>();
            for (Pacient p : pacients) {
                PacientDTO dto = new PacientDTO();
                dto.setPacientiId(p.getPacientiId());
                dto.setEmriMbiemri(p.getEmriMbiemri());
                dto.setNumriPersonal(p.getNumriPersonal());
                dto.setDitelindja(p.getDitelindja());
                dto.setVendbanimiID(p.getVendbanimi() != null ? p.getVendbanimi().getVendbanimiId() : null);
                dto.setVendbanimiEmri(p.getVendbanimi() != null ? p.getVendbanimi().getEmri() : null);
                dto.setGjinia(p.getGjinia());
                dto.setSigurimShendetsor(p.getSigurimShendetsor());
                dto.setAlergji(p.getAlergji());
                dto.setNderhyrje(p.getNderhyrje());
                dto.setSemundjeKronike(p.getSemundjeKronike());
                dtos.add(dto);
            }
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Gabim gjatë marrjes së pacientëve: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePacient(@PathVariable Long id) {
        try {
            pacientService.deletePacientById(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Gabim gjatë fshirjes së pacientit: " + e.getMessage());
        }
    }
}