package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.SemundjeKronike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SemundjeKronikeRepo extends JpaRepository<SemundjeKronike, Long> {
    List<SemundjeKronike> findByPacient_PacientiId(Long pacientiId);
}