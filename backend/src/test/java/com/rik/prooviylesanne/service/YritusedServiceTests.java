package com.rik.prooviylesanne.service;

import com.rik.prooviylesanne.dto.YritusedDto;
import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.model.YritusedIsikud;
import com.rik.prooviylesanne.repository.YritusedIsikudRepository;
import com.rik.prooviylesanne.repository.YritusedRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class YritusedServiceTests {

    @Mock
    private YritusedRepository yritusedRepository;

    @Mock
    private YritusedIsikudRepository yritusedIsikudRepository;

    @InjectMocks
    private YritusedService yritusedService;

    private Yritused testYritus;
    private List<Yritused> yritusedList;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testYritus = new Yritused();
        testYritus.setId(1L);
        testYritus.setNimi("Test Event");
        testYritus.setAeg(OffsetDateTime.of(2025, 12, 31, 23, 59, 0, 0, ZoneOffset.UTC));
        testYritus.setKoht("Test Location");
        testYritus.setLisainfo("Test Info");

        Yritused yritus2 = new Yritused();
        yritus2.setId(2L);
        yritus2.setNimi("Past Event");
        yritus2.setAeg(OffsetDateTime.of(2024, 1, 1, 12, 0, 0, 0, ZoneOffset.UTC));
        yritus2.setKoht("Past Location");
        yritus2.setLisainfo("Past Info");

        yritusedList = new ArrayList<>();
        yritusedList.add(testYritus);
        yritusedList.add(yritus2);
    }

    @Test
    void saveYritus_ShouldSaveAndReturnYritus() {
        when(yritusedRepository.save(any(Yritused.class))).thenReturn(testYritus);

        Yritused savedYritus = yritusedService.saveYritus(testYritus);

        assertNotNull(savedYritus);
        assertEquals(testYritus.getId(), savedYritus.getId());
        assertEquals(testYritus.getNimi(), savedYritus.getNimi());
        assertEquals(testYritus.getAeg(), savedYritus.getAeg());
        assertEquals(testYritus.getKoht(), savedYritus.getKoht());
        assertEquals(testYritus.getLisainfo(), savedYritus.getLisainfo());

        verify(yritusedRepository, times(1)).save(any(Yritused.class));
    }

    @Test
    void saveYritus_ShouldThrowExceptionForPastEvent() {
        Yritused pastYritus = new Yritused();
        pastYritus.setId(3L);
        pastYritus.setNimi("Past Event");
        pastYritus.setAeg(OffsetDateTime.now().minusDays(1)); // Event in the past
        pastYritus.setKoht("Past Location");

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> yritusedService.saveYritus(pastYritus));

        assertEquals("Cannot add an event with a date in the past", exception.getMessage());
        verify(yritusedRepository, never()).save(any(Yritused.class));
    }

    @Test
    void getYritusById_ShouldReturnYritusWhenFound() {
        when(yritusedRepository.findById(1L)).thenReturn(Optional.of(testYritus));

        Optional<Yritused> foundYritus = yritusedService.getYritusById(1L);

        assertTrue(foundYritus.isPresent());
        assertEquals(testYritus.getId(), foundYritus.get().getId());
        assertEquals(testYritus.getNimi(), foundYritus.get().getNimi());

        verify(yritusedRepository, times(1)).findById(1L);
    }

    @Test
    void getYritusById_ShouldReturnEmptyWhenNotFound() {
        when(yritusedRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<Yritused> foundYritus = yritusedService.getYritusById(999L);

        assertFalse(foundYritus.isPresent());
        verify(yritusedRepository, times(1)).findById(999L);
    }

    @Test
    void getAllYritused_ShouldReturnAllYritused() {
        when(yritusedRepository.findAll()).thenReturn(yritusedList);

        List<Yritused> foundYritused = yritusedService.getAllYritused();

        assertNotNull(foundYritused);
        assertEquals(2, foundYritused.size());
        assertEquals(testYritus.getId(), foundYritused.get(0).getId());
        assertEquals("Past Event", foundYritused.get(1).getNimi());

        verify(yritusedRepository, times(1)).findAll();
    }

    @Test
    void getAllYritusedAsDto_ShouldReturnAllYritusedAsDtoWithParticipantCount() {
        when(yritusedRepository.findAll()).thenReturn(yritusedList);

        // No participants for any event
        when(yritusedIsikudRepository.findByYritus(any(Yritused.class))).thenReturn(new ArrayList<>());

        List<YritusedDto> dtoList = yritusedService.getAllYritusedAsDto();

        assertNotNull(dtoList);
        assertEquals(2, dtoList.size());
        assertEquals(testYritus.getId(), dtoList.get(0).getId());
        assertEquals(testYritus.getNimi(), dtoList.get(0).getNimi());
        assertEquals(0, dtoList.get(0).getIsikudCount());

        verify(yritusedRepository, times(1)).findAll();
        verify(yritusedIsikudRepository, times(2)).findByYritus(any(Yritused.class));
    }

    @Test
    void deleteYritusWithRelatedRecords_ShouldDeleteWhenExists() {
        when(yritusedRepository.findById(1L)).thenReturn(Optional.of(testYritus));
        doNothing().when(yritusedIsikudRepository).deleteByYritus(testYritus);
        doNothing().when(yritusedRepository).delete(testYritus);

        boolean result = yritusedService.deleteYritusWithRelatedRecords(1L);

        assertTrue(result);
        verify(yritusedRepository, times(1)).findById(1L);
        verify(yritusedIsikudRepository, times(1)).deleteByYritus(testYritus);
        verify(yritusedRepository, times(1)).delete(testYritus);
    }

    @Test
    void deleteYritusWithRelatedRecords_ShouldReturnFalseWhenNotExists() {
        when(yritusedRepository.findById(999L)).thenReturn(Optional.empty());

        boolean result = yritusedService.deleteYritusWithRelatedRecords(999L);

        assertFalse(result);
        verify(yritusedRepository, times(1)).findById(999L);
        verify(yritusedIsikudRepository, never()).deleteByYritus(any(Yritused.class));
        verify(yritusedRepository, never()).delete(any(Yritused.class));
    }

    @Test
    void deleteYritusWithRelatedRecords_ShouldThrowExceptionForPastEvent() {
        Yritused pastYritus = new Yritused();
        pastYritus.setId(3L);
        pastYritus.setNimi("Past Event");
        pastYritus.setAeg(OffsetDateTime.now().minusDays(1)); // Event in the past
        pastYritus.setKoht("Past Location");

        when(yritusedRepository.findById(3L)).thenReturn(Optional.of(pastYritus));

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> yritusedService.deleteYritusWithRelatedRecords(3L));

        assertEquals("Cannot delete an event that has already passed", exception.getMessage());
        verify(yritusedRepository, times(1)).findById(3L);
        verify(yritusedIsikudRepository, never()).deleteByYritus(any(Yritused.class));
        verify(yritusedRepository, never()).delete(any(Yritused.class));
    }

    @Test
    void getYritusDtoById_ShouldReturnYritusDtoWhenFound() {
        // Setup
        when(yritusedRepository.findById(1L)).thenReturn(Optional.of(testYritus));
        when(yritusedIsikudRepository.findByYritus(testYritus)).thenReturn(new ArrayList<>());

        // Execute
        Optional<YritusedDto> result = yritusedService.getYritusDtoById(1L);

        // Verify
        assertTrue(result.isPresent());
        assertEquals(testYritus.getId(), result.get().getId());
        assertEquals(testYritus.getNimi(), result.get().getNimi());
        assertEquals(0, result.get().getIsikudCount());

        verify(yritusedRepository, times(1)).findById(1L);
        verify(yritusedIsikudRepository, times(1)).findByYritus(testYritus);
    }

    @Test
    void getYritusDtoById_ShouldReturnEmptyWhenNotFound() {
        // Setup
        when(yritusedRepository.findById(999L)).thenReturn(Optional.empty());

        // Execute
        Optional<YritusedDto> result = yritusedService.getYritusDtoById(999L);

        // Verify
        assertFalse(result.isPresent());
        verify(yritusedRepository, times(1)).findById(999L);
        verify(yritusedIsikudRepository, never()).findByYritus(any());
    }
}
