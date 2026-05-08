package com.internship.tool.service;

import com.internship.tool.entity.Incident;
import com.internship.tool.exception.ResourceNotFoundException;
import com.internship.tool.repository.IncidentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final EmailService emailService;

    public IncidentService(IncidentRepository incidentRepository,
                           EmailService emailService) {

        this.incidentRepository = incidentRepository;
        this.emailService = emailService;
    }

    public List<Incident> getAllIncidents() {
        return incidentRepository.findAll();
    }

    public Incident getIncidentById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Incident not found"));
    }

    public Incident createIncident(Incident incident) {

        Incident saved =
                incidentRepository.save(incident);

       // emailService.sendEmail(
         //       "yourgmail@gmail.com",
         //       "Incident Created",
           //     "New incident created: " + saved.getTitle()
        //);

        return saved;
    }

    public Incident updateIncident(Long id,
                                   Incident updatedIncident) {

        Incident incident = getIncidentById(id);

        incident.setTitle(updatedIncident.getTitle());
        incident.setDescription(updatedIncident.getDescription());
        incident.setStatus(updatedIncident.getStatus());
        incident.setSeverity(updatedIncident.getSeverity());

        Incident updated =
                incidentRepository.save(incident);

       // emailService.sendEmail(
         //       "yourgmail@gmail.com",
           //     "Incident Updated",
             //   "Incident updated: " + updated.getTitle()
        //);

        return updated;
    }

    public void deleteIncident(Long id) {
        incidentRepository.deleteById(id);
    }
}