package com.example.labkursSpring.service;

import com.example.labkursSpring.model.Pacient;
import com.example.labkursSpring.repository.PacientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PacientService {
    @Autowired
    private PacientRepo pacientRepo;

    public Pacient savePacient(Pacient pacient) {
        return pacientRepo.save(pacient);
    }

    public List<Pacient> getAllPacients() {
        return pacientRepo.findAll();
    }
}