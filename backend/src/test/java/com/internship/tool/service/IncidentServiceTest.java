package com.internship.tool.service;

import com.internship.tool.entity.Incident;
import com.internship.tool.repository.IncidentRepository;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;

    @InjectMocks
    private IncidentService incidentService;

    public IncidentServiceTest() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetIncidentById() {
        Incident incident = new Incident();
        incident.setId(1L);

        when(incidentRepository.findById(1L)).thenReturn(Optional.of(incident));

        Incident result = incidentService.getIncidentById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void testCreateIncident() {
        Incident incident = new Incident();
        incident.setTitle("Test Incident");

        when(incidentRepository.save(incident)).thenReturn(incident);

        Incident result = incidentService.createIncident(incident);

        assertEquals("Test Incident", result.getTitle());
    }

    @Test
    void testDeleteIncident() {
        doNothing().when(incidentRepository).deleteById(1L);

        incidentService.deleteIncident(1L);

        verify(incidentRepository, times(1)).deleteById(1L);
    }
}