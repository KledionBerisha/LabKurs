package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Vizita;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VizitaRepo extends JpaRepository<Vizita, Long> {
    List<Vizita> findByPacientiPacientiIDOrderByDataDesc(Long pacientiID);
    Optional<Vizita> findFirstByPacientiPacientiIDOrderByDataDesc(Long pacientiID);
}