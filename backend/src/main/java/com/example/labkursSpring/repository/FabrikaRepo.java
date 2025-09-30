package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Fabrika;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FabrikaRepo extends JpaRepository<Fabrika, Long> {
    List<Fabrika> findAll();
}