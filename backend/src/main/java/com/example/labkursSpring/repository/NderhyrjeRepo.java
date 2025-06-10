package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.Nderhyrje;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface NderhyrjeRepo extends JpaRepository<Nderhyrje, Long> {
    List<Nderhyrje> findByPacient_PacientiId(Long pacientiId);
}