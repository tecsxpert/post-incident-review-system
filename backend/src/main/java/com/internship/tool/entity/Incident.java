package com.internship.tool.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.List;
@Entity
public class Incident {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 private String title;
 private String description;
 private String status;

 @Column(name = "created_at")
 private LocalDateTime createdAt;

 public Incident() {}

 public Long getId() { return id; }
 public void setId(Long id) { this.id = id; }

 public String getTitle() { return title; }
 public void setTitle(String title) { this.title = title; }

 public String getDescription() { return description; }
 public void setDescription(String description) { this.description = description; }

 public String getStatus() { return status; }
 public void setStatus(String status) { this.status = status; }

 public LocalDateTime getCreatedAt() { return createdAt; }
 public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
 
 @PrePersist
 public void prePersist() {
  this.createdAt = LocalDateTime.now();
 }
}