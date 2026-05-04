package com.internship.tool.config;

import com.internship.tool.entity.Incident;
import com.internship.tool.repository.IncidentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {

 @Bean
 CommandLineRunner seedData(IncidentRepository repo) {
  return args -> {

   if (repo.count() > 0) return;

   for (int i = 1; i <= 15; i++) {
    Incident inc = new Incident();
    inc.setTitle("Incident " + i);
    inc.setDescription("Demo issue number " + i);
    inc.setStatus(i % 2 == 0 ? "OPEN" : "CLOSED");
    repo.save(inc);
   }
  };
 }
}