package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.SemundjeKronike;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SemundjeKronikeRepo extends JpaRepository<SemundjeKronike, Long> {
    
}