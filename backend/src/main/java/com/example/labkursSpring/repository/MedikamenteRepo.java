package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.Medikamente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedikamenteRepo extends JpaRepository<Medikamente, Long> {
    
}