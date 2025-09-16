package com.example.labkursSpring.repository;

import java.util.Optional;
import com.example.labkursSpring.model.Doktori;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoktoriRepo extends JpaRepository<Doktori, Long>{
    Optional<Doktori> findByUser_UserId(Long userId);
    boolean existsByUser_UserId(Long userId);
    
    Optional<Doktori> findByUsernameIgnoreCase(String username);
    Optional<Doktori> findByUser_EmailIgnoreCase(String email);
}