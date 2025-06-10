package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.Alergjia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlergjiaRepo extends JpaRepository<Alergjia, Long> {
    List<Alergjia> findByPacient_PacientiId(Long pacientiId);
}