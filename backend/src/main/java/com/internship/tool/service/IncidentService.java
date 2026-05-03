package com.internship.tool.service;

import com.internship.tool.entity.Incident;
import com.internship.tool.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Optional;

@Service
public class IncidentService {

 @Autowired
 private IncidentRepository incidentRepository;

 // ✅ SEARCH (with filters + date range)
 public Page<Incident> search(String q, String status, String start, String end, int page, int size) {

 Pageable pageable = PageRequest.of(page, size);

 LocalDateTime startDate = null;
 LocalDateTime endDate = null;

 if (start != null && !start.isEmpty()) {
  startDate = LocalDate.parse(start).atStartOfDay();
 }

 if (end != null && !end.isEmpty()) {
  endDate = LocalDate.parse(end).atTime(23, 59, 59);
 }

 // 🔥 IMPORTANT: Use default values instead of NULL
 if (startDate == null) {
  startDate = LocalDateTime.of(1970, 1, 1, 0, 0);
 }

 if (endDate == null) {
  endDate = LocalDateTime.now();
 }

 return incidentRepository.search(
  (q == null || q.trim().isEmpty()) ? "" : q,
  (status == null || status.trim().isEmpty()) ? "" : status,
  startDate,
  endDate,
  pageable
 );
}
public Incident getById(Long id) {
 return incidentRepository.findById(id)
  .orElseThrow(() -> new RuntimeException("Incident not found"));
}
 // ✅ GET ALL (pagination)
 public Page<Incident> getAll(int page, int size) {
  Pageable pageable = PageRequest.of(page, size);
  return incidentRepository.findAll(pageable);
 }
public Map<String, Long> getStats() {

 List<Incident> all = incidentRepository.findAll(); // 🔥 FULL DATA

 long total = all.size();
 long open = all.stream().filter(i -> "OPEN".equals(i.getStatus())).count();
 long closed = all.stream().filter(i -> "CLOSED".equals(i.getStatus())).count();

 Map<String, Long> stats = new HashMap<>();
 stats.put("total", total);
 stats.put("open", open);
 stats.put("closed", closed);

 return stats;
}
 // ✅ CREATE
 public Incident create(Incident incident) {
  return incidentRepository.save(incident);
 }

 // ✅ UPDATE
 public Incident update(Long id, Incident updatedIncident) {
  Optional<Incident> optionalIncident = incidentRepository.findById(id);

  if (optionalIncident.isPresent()) {
   Incident existing = optionalIncident.get();

   existing.setTitle(updatedIncident.getTitle());
   existing.setDescription(updatedIncident.getDescription());
   existing.setStatus(updatedIncident.getStatus());

   return incidentRepository.save(existing);
  } else {
   throw new RuntimeException("Incident not found with id " + id);
  }
 }

 // ✅ DELETE
 public void delete(Long id) {
  incidentRepository.deleteById(id);
 }
 public List<Incident> getAllList(){
 return incidentRepository.findAll();
}

public Map<String, Long> getStats(String period) {

 LocalDateTime now = LocalDateTime.now();
 LocalDateTime start = null;

 if ("7".equals(period)) start = now.minusDays(7);
 if ("30".equals(period)) start = now.minusDays(30);

 List<Incident> list = (start == null)
  ? incidentRepository.findAll()
  : incidentRepository.findByCreatedAtAfter(start);

 long total = list.size();
 long open = list.stream().filter(i -> "OPEN".equals(i.getStatus())).count();
 long closed = list.stream().filter(i -> "CLOSED".equals(i.getStatus())).count();

 return Map.of(
  "total", total,
  "open", open,
  "closed", closed
 );
}


}