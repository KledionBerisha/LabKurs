package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Vizita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface VizitaRepo extends JpaRepository<Vizita, Long> {

    // All visits for a patient ordered (entity field is 'pacienti')
    List<Vizita> findByPacienti_PacientiIdOrderByDataDesc(Long pacientiId);

    // Single latest visit (Spring Data derives limit 1)
    Vizita findFirstByPacienti_PacientiIdOrderByDataDesc(Long pacientiId);

    // Optional native fallback (not required, just example)
    @Query(value = "SELECT * FROM vizitat v WHERE v.PacientiID = :pid ORDER BY v.Data DESC LIMIT 1",
            nativeQuery = true)
    Vizita findLatestNative(@Param("pid") Long pacientiId);
}