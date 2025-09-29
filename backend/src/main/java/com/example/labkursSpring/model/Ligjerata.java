package com.example.labkursSpring.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "Ligjerata")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Ligjerata {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "LectureID")
    private Long lectureID;

    @Column(name = "LectureName")
    private String lectureName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "LecturerID")
    @JsonIgnoreProperties({"ligjerata"})
    private Ligjeruesi ligjerues;

    public Long getLectureID() {
        return lectureID;
    }

    public void setLectureID(Long lectureID) {
        this.lectureID = lectureID;
    }

    public String getLectureName() {
        return lectureName;
    }

    public void setLectureName(String lectureName) {
        this.lectureName = lectureName;
    }

    public Ligjeruesi getLigjerues() {
        return ligjerues;
    }

    public void setLigjerues(Ligjeruesi ligjerues) {
        this.ligjerues = ligjerues;
    }
}