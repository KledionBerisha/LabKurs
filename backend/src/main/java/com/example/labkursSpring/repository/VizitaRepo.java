package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Vizita;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VizitaRepo extends JpaRepository<Vizita, Long> {
    List<Vizita> findByPacientiPacientiIdOrderByDataDesc(Long pacientiId);
    Optional<Vizita> findFirstByPacientiPacientiIdOrderByDataDesc(Long pacientiId);


    @Query(value = "SELECT * FROM Vizitat v WHERE v.PacientiID = :pacientiId ORDER BY v.Data DESC, v.VizitatID DESC LIMIT 1", nativeQuery = true)
    Optional<Vizita> findLatestByPacienti(@Param("pacientiId") Long pacientiId);
}