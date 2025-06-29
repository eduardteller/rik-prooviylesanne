package com.rik.prooviylesanne.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rik.prooviylesanne.dto.YritusedDto;
import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.service.YritusedService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(YritusedController.class)
public class YritusedControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private YritusedService yritusedService;

    @Autowired
    private ObjectMapper objectMapper;

    private Yritused testYritus;
    private YritusedDto testYritusDto;
    private List<YritusedDto> yritusedDtoList;

    @BeforeEach
    void setUp() {
        testYritus = new Yritused();
        testYritus.setId(1L);
        testYritus.setNimi("Test Event");
        testYritus.setAeg(OffsetDateTime.of(2025, 12, 31, 23, 59, 0, 0, ZoneOffset.UTC));
        testYritus.setKoht("Test Location");
        testYritus.setLisainfo("Test Info");

        testYritusDto = new YritusedDto(
                1L,
                "Test Event",
                OffsetDateTime.of(2025, 12, 31, 23, 59, 0, 0, ZoneOffset.UTC),
                "Test Location",
                "Test Info",
                10
        );

        YritusedDto yritusDto2 = new YritusedDto(
                2L,
                "Past Event",
                OffsetDateTime.of(2024, 1, 1, 12, 0, 0, 0, ZoneOffset.UTC),
                "Past Location",
                "Past Info",
                5
        );

        yritusedDtoList = new ArrayList<>();
        yritusedDtoList.add(testYritusDto);
        yritusedDtoList.add(yritusDto2);
    }

    @Test
    void addYritus_ShouldReturnCreatedYritus() throws Exception {
        YritusedController.YritusRequest request = new YritusedController.YritusRequest();
        request.setNimi("Test Event");
        request.setAeg(OffsetDateTime.of(2025, 12, 31, 23, 59, 0, 0, ZoneOffset.UTC));
        request.setKoht("Test Location");
        request.setLisainfo("Test Info");

        when(yritusedService.saveYritus(any(Yritused.class))).thenReturn(testYritus);

        mockMvc.perform(post("/add-yritus")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nimi", is("Test Event")))
                .andExpect(jsonPath("$.koht", is("Test Location")));

        verify(yritusedService, times(1)).saveYritus(any(Yritused.class));
    }

    @Test
    void getAllYritusedWithCount_ShouldReturnAllYritusedWithCount() throws Exception {
        when(yritusedService.getAllYritusedAsDto()).thenReturn(yritusedDtoList);

        mockMvc.perform(get("/get-yritused"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].id", is(1)))
                .andExpect(jsonPath("$[0].nimi", is("Test Event")))
                .andExpect(jsonPath("$[0].isikudCount", is(10)))
                .andExpect(jsonPath("$[1].id", is(2)))
                .andExpect(jsonPath("$[1].nimi", is("Past Event")));

        verify(yritusedService, times(1)).getAllYritusedAsDto();
    }

    @Test
    void getYritusByIdWithCount_ShouldReturnYritusWithCount() throws Exception {
        when(yritusedService.getYritusDtoById(1L)).thenReturn(Optional.of(testYritusDto));

        mockMvc.perform(get("/get-yritused?id=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nimi", is("Test Event")))
                .andExpect(jsonPath("$.koht", is("Test Location")))
                .andExpect(jsonPath("$.isikudCount", is(10)));

        verify(yritusedService, times(1)).getYritusDtoById(1L);
    }

    @Test
    void getYritusById_ShouldReturnEmptyWhenNotFound() throws Exception {
        when(yritusedService.getYritusDtoById(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/get-yritused?id=999"))
                .andExpect(status().isNotFound());

        verify(yritusedService, times(1)).getYritusDtoById(999L);
    }

    @Test
    void deleteYritus_ShouldReturnSuccessWhenDeleted() throws Exception {
        when(yritusedService.deleteYritusWithRelatedRecords(1L)).thenReturn(true);

        mockMvc.perform(get("/delete-yritus?id=1"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("deleted successfully")));

        verify(yritusedService, times(1)).deleteYritusWithRelatedRecords(1L);
    }

    @Test
    void deleteYritus_ShouldReturnNotFoundWhenNotDeleted() throws Exception {
        when(yritusedService.deleteYritusWithRelatedRecords(999L)).thenReturn(false);

        mockMvc.perform(get("/delete-yritus?id=999"))
                .andExpect(status().isNotFound())
                .andExpect(content().string(containsString("not found")));

        verify(yritusedService, times(1)).deleteYritusWithRelatedRecords(999L);
    }

    @Test
    void addYritus_ShouldReturnErrorOnFailure() throws Exception {
        YritusedController.YritusRequest request = new YritusedController.YritusRequest();
        request.setNimi("Test Event");
        request.setAeg(OffsetDateTime.of(2025, 12, 31, 23, 59, 0, 0, ZoneOffset.UTC));
        request.setKoht("Test Location");
        request.setLisainfo("Test Info");

        when(yritusedService.saveYritus(any(Yritused.class))).thenThrow(new RuntimeException("Database error"));

        mockMvc.perform(post("/add-yritus")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Failed to add event")));

        verify(yritusedService, times(1)).saveYritus(any(Yritused.class));
    }

    @Test
    void addYritus_ShouldReturnBadRequestForPastEvent() throws Exception {
        YritusedController.YritusRequest request = new YritusedController.YritusRequest();
        request.setNimi("Past Event");
        request.setAeg(OffsetDateTime.now().minusDays(1)); // Event in the past
        request.setKoht("Past Location");
        request.setLisainfo("Past Info");

        when(yritusedService.saveYritus(any(Yritused.class)))
                .thenThrow(new IllegalArgumentException("Cannot add an event with a date in the past"));

        mockMvc.perform(post("/add-yritus")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Cannot add an event with a date in the past"));

        verify(yritusedService, times(1)).saveYritus(any(Yritused.class));
    }

    @Test
    void deleteYritus_ShouldReturnBadRequestForPastEvent() throws Exception {
        when(yritusedService.deleteYritusWithRelatedRecords(3L))
                .thenThrow(new IllegalArgumentException("Cannot delete an event that has already passed"));

        mockMvc.perform(get("/delete-yritus?id=3"))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Cannot delete an event that has already passed"));

        verify(yritusedService, times(1)).deleteYritusWithRelatedRecords(3L);
    }
}
