package com.example.labkursSpring.repository;
import com.example.labkursSpring.model.Vendbanimi;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface VendbanimiRepo extends JpaRepository<Vendbanimi, Long> {
}