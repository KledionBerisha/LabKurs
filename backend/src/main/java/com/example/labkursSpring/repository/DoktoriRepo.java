package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Doktori;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoktoriRepo extends JpaRepository<Doktori, Long>{
    
}