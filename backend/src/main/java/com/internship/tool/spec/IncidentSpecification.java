package com.internship.tool.spec;

import com.internship.tool.entity.Incident;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class IncidentSpecification {

 public static Specification<Incident> search(String q, String status,
  LocalDateTime start, LocalDateTime end) {

  return (root, query, cb) -> {
   var predicate = cb.conjunction();

   if (q != null && !q.isEmpty()) {
    predicate = cb.and(predicate,
     cb.or(
      cb.like(cb.lower(root.get("title")), "%" + q.toLowerCase() + "%"),
      cb.like(cb.lower(root.get("description")), "%" + q.toLowerCase() + "%")
     )
    );
   }

   if (status != null && !status.isEmpty()) {
    predicate = cb.and(predicate,
     cb.equal(root.get("status"), status));
   }

   if (start != null) {
    predicate = cb.and(predicate,
     cb.greaterThanOrEqualTo(root.get("createdAt"), start));
   }

   if (end != null) {
    predicate = cb.and(predicate,
     cb.lessThanOrEqualTo(root.get("createdAt"), end));
   }

   return predicate;
  };
 }
}