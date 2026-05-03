package com.internship.tool.controller;

import java.io.PrintWriter;
import java.util.Map;
import com.internship.tool.entity.Incident;
import com.internship.tool.service.IncidentService;
import java.util.List;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
public Map<String, Long> getStats(
 @RequestParam(defaultValue = "7") String period
){
 return incidentService.getStats(period);
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
 @GetMapping("/export")
public void exportCsv(HttpServletResponse response) throws Exception {

 response.setContentType("text/csv");
 response.setHeader("Content-Disposition", "attachment; filename=incidents.csv");

 List<Incident> list = incidentService.getAllList();

 PrintWriter writer = response.getWriter();

 writer.println("ID,Title,Description,Status");

 for(Incident i : list){
  writer.println(i.getId()+","+i.getTitle()+","+i.getDescription()+","+i.getStatus());
 }

 writer.flush();
 writer.close();
}

@PostMapping(value = "/upload", consumes = "multipart/form-data")
public String uploadFile(@RequestParam("file") MultipartFile file) {

 if (file.isEmpty()) {
  return "No file selected";
 }

 if (file.getSize() > 2 * 1024 * 1024) {
  return "File too large";
 }

 String type = file.getContentType();

 if (!type.equals("text/plain") && !type.equals("application/pdf")) {
  return "Only TXT or PDF allowed";
 }

 return "File uploaded successfully";
}




}