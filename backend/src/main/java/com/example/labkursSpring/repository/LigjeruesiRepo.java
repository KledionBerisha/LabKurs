package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Ligjeruesi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LigjeruesiRepo extends JpaRepository<Ligjeruesi, Long> {
    List<Ligjeruesi> findAll();
}