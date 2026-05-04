package com.internship.tool.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.internship.tool.entity.Incident;
import com.internship.tool.service.IncidentService;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IncidentController.class)
public class IncidentControllerTest {

 @Autowired
 private MockMvc mockMvc;

 @Autowired
 private ObjectMapper objectMapper;

 @MockBean
 private IncidentService incidentService;

 @Test
 void testCreateIncident() throws Exception {
  Incident incident = new Incident();
  incident.setTitle("Test");
  incident.setDescription("Test Desc");
  incident.setStatus("OPEN");

  mockMvc.perform(post("/api/incidents")
    .contentType(MediaType.APPLICATION_JSON)
    .content(objectMapper.writeValueAsString(incident)))
    .andExpect(status().isOk());
 }
}