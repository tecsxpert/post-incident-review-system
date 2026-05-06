package com.internship.tool.config;

import com.internship.tool.entity.Incident;
import com.internship.tool.repository.IncidentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataSeeder implements CommandLineRunner {

    private final IncidentRepository incidentRepository;

    public DataSeeder(IncidentRepository incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    @Override
    public void run(String... args) {

        if (incidentRepository.count() >= 30) {
            System.out.println("Demo data already exists.");
            return;
        }

        for (int i = 1; i <= 30; i++) {
            Incident incident = new Incident();

            incident.setTitle("Demo Incident " + i);
            incident.setDescription("This is a sample post-incident review record for testing.");
            incident.setStatus(i % 3 == 0 ? "Closed" : i % 2 == 0 ? "In Progress" : "Open");
            incident.setSeverity(i % 3 == 0 ? "High" : i % 2 == 0 ? "Medium" : "Low");
            incident.setReportedBy("User " + i);
            incident.setIncidentDate(LocalDateTime.now().minusDays(i));

            incidentRepository.save(incident);
        }

        System.out.println("30 demo incident records inserted successfully.");
    }
}