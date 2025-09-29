package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;

public interface PlayerRepo extends JpaRepository<Player, Long> {

    @EntityGraph(attributePaths = {"team"})
    List<Player> findAll();

    @EntityGraph(attributePaths = {"team"})
    List<Player> findByTeam_teamID(Long teamID);
}