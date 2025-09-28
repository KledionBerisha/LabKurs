package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Planet232470151;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlanetRepo232470151 extends JpaRepository<Planet232470151, Long> {
    List<Planet232470151> findByIsDeletedFalse();
}