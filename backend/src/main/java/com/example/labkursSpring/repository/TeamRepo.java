package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TeamRepo extends JpaRepository<Team, Long> {
    List<Team> findAll();
}