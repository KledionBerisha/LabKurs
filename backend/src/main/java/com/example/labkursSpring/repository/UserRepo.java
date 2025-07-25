package com.example.labkursSpring.repository;

import com.example.labkursSpring.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepo extends JpaRepository<Users, Long> {
    Optional<Users> findByEmail(String email);
}