package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.service.PacientService;
import org.springframework.web.bind.annotation.*;
import com.example.labkursSpring.dto.PacientRequest;
import com.example.labkursSpring.model.Vendbanimi;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/pacientet")
public class PacientController {
    private final PacientService pacientService;

    public PacientController(PacientService pacientService) {
        this.pacientService = pacientService;
    }

    @GetMapping
    public List<Pacient> getAllPacients() {
        return pacientService.getAllPacients();
    }

    @PostMapping
    public Pacient createPacient(@RequestBody PacientRequest req) {
    try{Pacient pacient = new Pacient();
    pacient.setEmriMbiemri(req.emriMbiemri);
    pacient.setNumriPersonal(req.numriPersonal);
    pacient.setGjinia(req.gjinia);
    pacient.setSigurimShendetsor(req.sigurimShendetsor);
    pacient.setAlergji(req.alergji);
    pacient.setNderhyrje(req.nderhyrje);
    pacient.setSemundjeKronike(req.semundjeKronike);
    // Parse date
    if (req.dataLindjes == null || req.dataLindjes.isEmpty()) {
            throw new IllegalArgumentException("Data e lindjes nuk duhet të jetë bosh!");
        }
        pacient.setDitelindja(java.sql.Date.valueOf(req.dataLindjes));
    // Set vendbanimi
    Vendbanimi vendbanimi = new Vendbanimi();
    vendbanimi.setVendbanimiId(req.vendbanimiID);
    pacient.setVendbanimi(vendbanimi);
    return pacientService.savePacient(pacient);
    } catch (Exception e) {
        e.printStackTrace();
        throw e;
    }
}
}