package com.example.labkursSpring.repository;

import java.util.Optional;
import com.example.labkursSpring.model.Infermieri;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InfermieriRepo extends JpaRepository<Infermieri, Long> {
   Optional<Infermieri> findByUser_UserId(Long userId);
   boolean existsByUser_UserId(Long userId);

   Optional<Infermieri> findByUsernameIgnoreCase(String username);
   Optional<Infermieri> findByUser_EmailIgnoreCase(String email);
}