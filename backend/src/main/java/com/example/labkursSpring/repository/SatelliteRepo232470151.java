package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Satellite232470151;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.List;

public interface SatelliteRepo232470151 extends JpaRepository<Satellite232470151, Long>{

    @EntityGraph(attributePaths = {"planet"})
    List<Satellite232470151> findByIsDeletedFalse();

    @EntityGraph(attributePaths = {"planet"})
    List<Satellite232470151> findByPlanetPlanet232470151IdAndIsDeletedFalse(Long planetId);
}