package com.internship.tool.controller;

import com.internship.tool.entity.Incident;
import com.internship.tool.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*")
public class IncidentController {

 @Autowired
 private IncidentRepository repository;

 @PostMapping
 public Incident create(@RequestBody Incident incident){
  return repository.save(incident);
 }

 @GetMapping
 public Page<Incident> getAll(
  @RequestParam(defaultValue="0") int page,
  @RequestParam(defaultValue="5") int size
 ){
  return repository.findAll(
   PageRequest.of(page,size,Sort.by("id").descending())
  );
 }

 @GetMapping("/{id}")
 public Incident getOne(@PathVariable Long id){
  return repository.findById(id).orElseThrow();
 }

 @PutMapping("/{id}")
 public Incident update(@PathVariable Long id,@RequestBody Incident data){
  Incident i = repository.findById(id).orElseThrow();

  i.setTitle(data.getTitle());
  i.setDescription(data.getDescription());
  i.setStatus(data.getStatus());
  i.setSeverity(data.getSeverity());

  return repository.save(i);
 }

 @DeleteMapping("/{id}")
 public void delete(@PathVariable Long id){
  repository.deleteById(id);
 }
}