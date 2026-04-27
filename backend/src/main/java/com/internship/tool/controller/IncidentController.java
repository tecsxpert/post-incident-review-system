package com.internship.tool.controller;

import com.internship.tool.entity.Incident;
import com.internship.tool.repository.IncidentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

 @Autowired
 private IncidentRepository repo;

 @PostMapping
 @PreAuthorize("hasRole('ADMIN')")
 @CacheEvict(value = {"incidents", "search"}, allEntries = true)
 public Incident create(@RequestBody Incident incident) {

  incident.setIncidentDate(LocalDateTime.now());
  incident.setIsDeleted(false);

  return repo.save(incident);
 }

 @GetMapping("/all")
 @PreAuthorize("hasAnyRole('ADMIN','USER')")
 @Cacheable(value = "incidents")
 public Page<Incident> getAll(Pageable pageable) {

  return repo.findAll(pageable);
 }

 @GetMapping("/search")
 @PreAuthorize("hasAnyRole('ADMIN','USER')")
 @Cacheable(value = "search")
 public List<Incident> search(@RequestParam String q) {

  return repo.findByTitleContainingIgnoreCase(q);
 }

 @PutMapping("/{id}")
 @PreAuthorize("hasRole('ADMIN')")
 @CacheEvict(value = {"incidents", "search"}, allEntries = true)
 public Incident update(@PathVariable Long id, @RequestBody Incident updated) {

  Incident existing = repo.findById(id)
   .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));

  existing.setTitle(updated.getTitle());
  existing.setDescription(updated.getDescription());
  existing.setSeverity(updated.getSeverity());
  existing.setStatus(updated.getStatus());

  return repo.save(existing);
 }


 @DeleteMapping("/{id}")
 @PreAuthorize("hasRole('ADMIN')")
 @CacheEvict(value = {"incidents", "search"}, allEntries = true)
 public void delete(@PathVariable Long id) {

  Incident incident = repo.findById(id)
   .orElseThrow(() -> new RuntimeException("Incident not found with id: " + id));

  incident.setIsDeleted(true);
  repo.save(incident);
 }
}