package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.service.PacientService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pacientet")
@CrossOrigin(origins = "http://localhost:3000/app/ShtoPacientin")
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
    public Pacient createPacient(@RequestBody Pacient pacient) {
        return pacientService.savePacient(pacient);
    }
}