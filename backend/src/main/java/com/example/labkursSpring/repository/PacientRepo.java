package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Pacient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface PacientRepo extends JpaRepository<Pacient, Long> {

    // Full entities (if ever needed)
    List<Pacient> findByVendbanimi_VendbanimiId(Long vendbanimiId);

    // Just a count (fast pre-check)
    long countByVendbanimi_VendbanimiId(Long vendbanimiId);

    // Lightweight projection for dependents listing
    @Query("select p.pacientiId as id, p.emriMbiemri as emriMbiemri, p.numriPersonal as numriPersonal " +
           "from Pacient p where p.vendbanimi.vendbanimiId = :vendbanimiId")
    List<PacientSummary> findSummariesByVendbanimiId(Long vendbanimiId);

    interface PacientSummary {
        Long getId();
        String getEmriMbiemri();
        Long getNumriPersonal();
    }
}