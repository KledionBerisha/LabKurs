package com.example.labkursSpring.controller;

import com.example.labkursSpring.model.Doktori;
import com.example.labkursSpring.repository.DoktoriRepo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doktori")
@CrossOrigin(origins = "http://localhost:3000")
public class DoktoriController {

    private final DoktoriRepo doktoriRepo;

    public DoktoriController(DoktoriRepo doktoriRepo) {
        this.doktoriRepo = doktoriRepo;
    }

    @GetMapping
    public List<DoktoriDTO> list() {
        return doktoriRepo.findAll()
                .stream()
                .map(d -> new DoktoriDTO(d.getDoktoriId(), d.getEmriMbiemri(), d.getUsername()))
                .toList();
    }

    public record DoktoriDTO(Long doktoriId, String emriMbiemri, String username) {}
}