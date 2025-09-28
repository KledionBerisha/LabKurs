package com.example.labkursSpring.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Satellite232470151")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Satellite232470151 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "satellite232470151_id")
    private Long satellite232470151Id;

    @Column(name = "name")
    private String name;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "planet_id")
    @JsonIgnoreProperties({"satellites"})
    private Planet232470151 planet;

    public Long getSatellite232470151Id() { return satellite232470151Id; }
    public void setSatellite232470151Id(Long id) { this.satellite232470151Id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public boolean isIsDeleted() { return isDeleted; }
    public void setIsDeleted(boolean isDeleted) { this.isDeleted = isDeleted; }
    public Planet232470151 getPlanet() { return planet; }
    public void setPlanet(Planet232470151 planet) { this.planet = planet; }
}