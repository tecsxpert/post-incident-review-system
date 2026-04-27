package com.internship.tool.repository;

import com.internship.tool.entity.Incident;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IncidentRepository extends JpaRepository<Incident, Long> {

 // ✅ already used earlier
 List<Incident> findByTitleContainingIgnoreCase(String title);

 // ✅ FIX FOR YOUR ERROR
 List<Incident> findByIsDeletedFalse();

 List<Incident> findByTitleContainingIgnoreCaseAndIsDeletedFalse(String title);
}