package com.example.labkursSpring.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.List;

@Entity
@Table(name = "Ligjeruesi")
public class Ligjeruesi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LecturerID")
    private Long lecturerID;

    @Column(name = "LecturerName")
    private String lecturerName;

    @Column(name = "Departament")
    private String departament;

    @Column(name = "Email")
    private String email;

    @OneToMany(mappedBy = "ligjerues", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Ligjerata> ligjerata;

    public Long getLecturerID() {
        return lecturerID;
    }

    public void setLecturerID(Long lecturerID) {
        this.lecturerID = lecturerID;
    }

    public String getLecturerName() {
        return lecturerName;
    }

    public void setLecturerName(String lecturerName) {
        this.lecturerName = lecturerName;
    }

    public String getDepartament() {
        return departament;
    }

    public void setDepartament(String departament) {
        this.departament = departament;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<Ligjerata> getLigjerata() {
        return ligjerata;
    }

    public void setLigjerata(List<Ligjerata> ligjerata) {
        this.ligjerata = ligjerata;
    }
}