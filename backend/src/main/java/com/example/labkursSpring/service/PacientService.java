package com.example.labkursSpring.service;

import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.PacientRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacientService {
    private final PacientRepo pacientRepo;

    public PacientService(PacientRepo pacientRepo){
        this.pacientRepo = pacientRepo;
    }

    public List<Pacient> getAllPacients() {
        return pacientRepo.findAll();
    }

    public Pacient savePacient(Pacient pacient) {
        return pacientRepo.save(pacient);
    }
}