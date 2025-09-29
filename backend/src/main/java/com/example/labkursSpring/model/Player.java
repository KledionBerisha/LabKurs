package com.example.labkursSpring.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Player")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PlayerID")
    private Long PlayerID;

    @Column(name = "Name")
    private String name;

    @Column(name = "Number")
    private Long number;

    public Long getNumber() {
        return number;
    }

    public void setNumber(Long number) {
        this.number = number;
    }

    @Column(name = "BirthYear")
    private Long BirthYear;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "TeamID")
    @JsonIgnoreProperties({"player"})
    private Team team;

    public Long getPlayerID() {
        return PlayerID;
    }

    public void setPlayerID(Long playerID) {
        this.PlayerID = playerID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getBirthYear() {
        return BirthYear;
    }

    public void setBirthYear(Long birthYear) {
        this.BirthYear = birthYear;
    }

    public Team getTeam() {
        return team;
    }

    public void setTeam(Team team) {
        this.team = team;
    }
}