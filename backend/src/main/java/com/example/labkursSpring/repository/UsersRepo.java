package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepo extends JpaRepository<Users, Long> {
    
}