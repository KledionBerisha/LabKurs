package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.VizitaFunditView;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VizitaFunditViewRepo extends JpaRepository<VizitaFunditView, Long> {
    Optional<VizitaFunditView> findByPacientiId(Long pacientiId);
}