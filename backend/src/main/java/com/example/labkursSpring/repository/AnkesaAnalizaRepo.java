package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.AnkesaAnaliza;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnkesaAnalizaRepo extends JpaRepository<AnkesaAnaliza, Long> {
    List<AnkesaAnaliza> findByPacient_PacientiId(Long pacientiId);
}