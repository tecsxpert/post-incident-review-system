package com.internship.tool.repository;

import com.internship.tool.entity.Incident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long> {

 @Query("""
 SELECT i FROM Incident i
 WHERE
 (:q = '' OR LOWER(i.title) LIKE LOWER(CONCAT('%', :q, '%')))
 AND (:status = '' OR i.status = :status)
 AND i.createdAt BETWEEN :start AND :end
 """)
 Page<Incident> search(
  @Param("q") String q,
  @Param("status") String status,
  @Param("start") LocalDateTime start,
  @Param("end") LocalDateTime end,
  Pageable pageable
 );

 List<Incident> findByCreatedAtAfter(LocalDateTime time);

 // ✅ ADD THIS (FOR PERFORMANCE)
 @Query("SELECT COUNT(i) FROM Incident i WHERE i.createdAt > :time")
 long countRecent(@Param("time") LocalDateTime time);
}