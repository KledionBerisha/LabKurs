package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.KartelaVaksinimit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface KartelaVaksinimitRepo extends JpaRepository<KartelaVaksinimit, Long> {
    List<KartelaVaksinimit> findByPacient_PacientiId(Long pacientiId);
}