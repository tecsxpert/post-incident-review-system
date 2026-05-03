package com.internship.tool.controller;

import java.util.Map;
import com.internship.tool.entity.Incident;
import com.internship.tool.service.IncidentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/incidents")
public class IncidentController {

 @Autowired
 private IncidentService incidentService;

 // SEARCH
 @GetMapping("/search")
 public Page<Incident> search(
  @RequestParam(required = false) String q,
  @RequestParam(required = false) String status,
  @RequestParam(required = false) String start,
  @RequestParam(required = false) String end,
  @RequestParam int page,
  @RequestParam int size
 ) {
  return incidentService.search(q, status, start, end, page, size);
 }

 // GET ALL
 @GetMapping
 public Page<Incident> getAll(
  @RequestParam int page,
  @RequestParam int size
 ) {
  return incidentService.getAll(page, size);
 }

 // STATS
 @GetMapping("/stats")
 public Map<String, Long> getStats() {
  return incidentService.getStats();
 }

 // ✅ FIXED CREATE (IMPORTANT)
 @PostMapping
 public Incident create(@RequestBody Incident incident) {
  return incidentService.create(incident);
 }

 // GET BY ID
 @GetMapping("/{id}")
 public Incident getById(@PathVariable Long id) {
  return incidentService.getById(id);
 }

 // UPDATE
 @PutMapping("/{id}")
 public Incident update(@PathVariable Long id, @RequestBody Incident incident) {
  return incidentService.update(id, incident);
 }

 // DELETE
 @DeleteMapping("/{id}")
 public void delete(@PathVariable Long id) {
  incidentService.delete(id);
 }
}