package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Ligjerata;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;

public interface LigjerataRepo extends JpaRepository<Ligjerata, Long>{

    @EntityGraph(attributePaths = {"ligjerues"})
    List<Ligjerata> findAll();

    @EntityGraph(attributePaths = {"ligjerues"})
    List<Ligjerata> findByLigjerues_LecturerID(Long LecturerID);
}