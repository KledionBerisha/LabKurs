package com.example.labkursSpring.service;

import com.example.labkursSpring.model.Vendbanimi;
import com.example.labkursSpring.repository.VendbanimiRepo;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.List;

@Service
public class VendbanimiService {
    private final VendbanimiRepo repo;

    public VendbanimiService(VendbanimiRepo repo) {
        this.repo = repo;
    }

    public List<Vendbanimi> findAll() {
        return repo.findAll();
    }

    public Vendbanimi create(String emri) {
        Vendbanimi v = new Vendbanimi();
        v.setEmri(emri);
        return repo.save(v);
    }

    public void delete(Long id) {
        try {
            repo.deleteById(id);
        } catch (DataIntegrityViolationException ex) {
            throw new IllegalStateException("VENDBANIMI_IN_USE");
        }
    }
}