package com.internship.tool.service;

import com.internship.tool.entity.Incident;
import com.internship.tool.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository repo;

    public IncidentService(IncidentRepository repo) {
        this.repo = repo;
    }

    public List<Incident> getAll() {
        return repo.findAll();
    }

    public Incident save(Incident incident) {
        return repo.save(incident);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }

    public List<Incident> search(String keyword) {
        return repo.findAll(); // simplified
    }
}