package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Punetori;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;

public interface PunetoriRepo extends JpaRepository<Punetori, Long> {

    @EntityGraph(attributePaths = {"fabrika"})
    List<Punetori> findAll();

    @EntityGraph(attributePaths = {"fabrika"})
    List<Punetori> findByFabrika_fabrikaID(Long fabrikaID);
}