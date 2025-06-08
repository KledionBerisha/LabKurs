package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.Pacient;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacientRepo extends JpaRepository<Pacient, Long> {
    
}