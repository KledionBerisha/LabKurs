package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.Medikamente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MedikamenteRepo extends JpaRepository<Medikamente, Long> {
    List<Medikamente> findByPacient_PacientiId(Long pacientiId);
}