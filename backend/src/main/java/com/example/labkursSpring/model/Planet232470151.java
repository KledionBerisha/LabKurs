package com.example.labkursSpring.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "Planet232470151")
public class Planet232470151 {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "planet232470151_id")
    private Long planet232470151Id;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "is_deleted")
    private boolean isDeleted = false;

    @OneToMany(mappedBy = "planet", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Satellite232470151> satellites;

    public Long getPlanet232470151Id() { return planet232470151Id; }
    public void setPlanet232470151Id(Long id) { this.planet232470151Id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public boolean isIsDeleted() { return isDeleted; }
    public void setIsDeleted(boolean isDeleted) { this.isDeleted = isDeleted; }
    public List<Satellite232470151> getSatellites() { return satellites; }
    public void setSatellites(List<Satellite232470151> satellites) { this.satellites = satellites; }
}