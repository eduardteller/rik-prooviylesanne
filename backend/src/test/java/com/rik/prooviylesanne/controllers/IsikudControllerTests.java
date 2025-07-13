package com.rik.prooviylesanne.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rik.prooviylesanne.model.FyysilisedIsikud;
import com.rik.prooviylesanne.model.JuriidilisedIsikud;
import com.rik.prooviylesanne.model.MaksmiseViisid;
import com.rik.prooviylesanne.service.IsikudService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IsikudController.class)
public class IsikudControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IsikudService isikudService;

    @Autowired
    private ObjectMapper objectMapper;

    private FyysilisedIsikud testFyysilineIsik;
    private JuriidilisedIsikud testJuriidilineIsik;
    private IsikudController.FyysilineIsikRequest fyysilineIsikRequest;
    private IsikudController.JuriidilineIsikRequest juriidilineIsikRequest;
    private IsikudController.FyysilineIsikUpdateRequest fyysilineIsikUpdateRequest;
    private IsikudController.JuriidilineIsikUpdateRequest juriidilineIsikUpdateRequest;
    private Map<String, Object> allIsikudMap;

    @BeforeEach
    void setUp() {
        MaksmiseViisid maksmiseViis = new MaksmiseViisid();
        maksmiseViis.setId(1L);
        maksmiseViis.setMaksmiseViis("pangaülekanne");

        testFyysilineIsik = new FyysilisedIsikud();
        testFyysilineIsik.setId(1L);
        testFyysilineIsik.setEesnimi("John");
        testFyysilineIsik.setPerekonnanimi("Doe");
        testFyysilineIsik.setIsikukood("38001085718");
        testFyysilineIsik.setLisainfo("Test info");
        testFyysilineIsik.setMaksmiseViis(maksmiseViis);

        testJuriidilineIsik = new JuriidilisedIsikud();
        testJuriidilineIsik.setId(1L);
        testJuriidilineIsik.setNimi("Test Company");
        testJuriidilineIsik.setRegistrikood("12345678");
        testJuriidilineIsik.setOsavotjateArv("5");
        testJuriidilineIsik.setLisainfo("Company test info");
        testJuriidilineIsik.setMaksmiseViis(maksmiseViis);

        fyysilineIsikRequest = new IsikudController.FyysilineIsikRequest();
        fyysilineIsikRequest.setEesnimi("John");
        fyysilineIsikRequest.setPerekonnanimi("Doe");
        fyysilineIsikRequest.setIsikukood("38001085718");
        fyysilineIsikRequest.setMaksmiseViis("pangaülekanne");
        fyysilineIsikRequest.setLisainfo("Test info");
        fyysilineIsikRequest.setYritusId(1L);

        juriidilineIsikRequest = new IsikudController.JuriidilineIsikRequest();
        juriidilineIsikRequest.setNimi("Test Company");
        juriidilineIsikRequest.setRegistrikood("12345678");
        juriidilineIsikRequest.setOsavotjateArv("5");
        juriidilineIsikRequest.setMaksmiseViis("pangaülekanne");
        juriidilineIsikRequest.setLisainfo("Company test info");
        juriidilineIsikRequest.setYritusId(1L);

        fyysilineIsikUpdateRequest = new IsikudController.FyysilineIsikUpdateRequest();
        fyysilineIsikUpdateRequest.setId(1L);
        fyysilineIsikUpdateRequest.setEesnimi("John Updated");
        fyysilineIsikUpdateRequest.setPerekonnanimi("Doe Updated");
        fyysilineIsikUpdateRequest.setIsikukood("38001085718");
        fyysilineIsikUpdateRequest.setMaksmiseViis("sularaha");
        fyysilineIsikUpdateRequest.setLisainfo("Updated test info");

        juriidilineIsikUpdateRequest = new IsikudController.JuriidilineIsikUpdateRequest();
        juriidilineIsikUpdateRequest.setId(1L);
        juriidilineIsikUpdateRequest.setNimi("Test Company Updated");
        juriidilineIsikUpdateRequest.setRegistrikood("12345678");
        juriidilineIsikUpdateRequest.setOsavotjateArv("7");
        juriidilineIsikUpdateRequest.setMaksmiseViis("sularaha");
        juriidilineIsikUpdateRequest.setLisainfo("Updated company test info");

        List<FyysilisedIsikud> fyysilisedIsikud = new ArrayList<>();
        fyysilisedIsikud.add(testFyysilineIsik);

        List<JuriidilisedIsikud> juriidilisedIsikud = new ArrayList<>();
        juriidilisedIsikud.add(testJuriidilineIsik);

        allIsikudMap = new HashMap<>();
        allIsikudMap.put("fyysilisedIsikud", fyysilisedIsikud);
        allIsikudMap.put("juriidilisedIsikud", juriidilisedIsikud);
    }

    @Test
    void addFyysilineIsik_ShouldAddPersonAndReturnIt() throws Exception {
        when(isikudService.addFyysilineIsikToYritus(any(FyysilisedIsikud.class), anyLong(), anyString()))
                .thenReturn(testFyysilineIsik);

        mockMvc.perform(post("/api/isikud/add-fyysiline-isik")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(fyysilineIsikRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.eesnimi", is("John")))
                .andExpect(jsonPath("$.perekonnanimi", is("Doe")))
                .andExpect(jsonPath("$.isikukood", is("38001085718")))
                .andExpect(jsonPath("$.maksmiseViis.maksmiseViis", is("pangaülekanne")));

        verify(isikudService, times(1)).addFyysilineIsikToYritus(any(FyysilisedIsikud.class), anyLong(), anyString());
    }

    @Test
    void addJuriidilineIsik_ShouldAddCompanyAndReturnIt() throws Exception {
        when(isikudService.addJuriidilineIsikToYritus(any(JuriidilisedIsikud.class), anyLong(), anyString()))
                .thenReturn(testJuriidilineIsik);

        mockMvc.perform(post("/api/isikud/add-juriidiline-isik")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(juriidilineIsikRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nimi", is("Test Company")))
                .andExpect(jsonPath("$.registrikood", is("12345678")))
                .andExpect(jsonPath("$.osavotjateArv", is("5")))
                .andExpect(jsonPath("$.maksmiseViis.maksmiseViis", is("pangaülekanne")));

        verify(isikudService, times(1)).addJuriidilineIsikToYritus(any(JuriidilisedIsikud.class), anyLong(), anyString());
    }

    @Test
    void deleteFyysilineIsik_ShouldDeleteAndReturnSuccess() throws Exception {
        when(isikudService.deleteFyysilineIsik(1L)).thenReturn(true);

        mockMvc.perform(get("/api/isikud/delete-fyysiline-isik?id=1"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("successfully deleted")));

        verify(isikudService, times(1)).deleteFyysilineIsik(1L);
    }

    @Test
    void deleteJuriidilineIsik_ShouldDeleteAndReturnSuccess() throws Exception {
        when(isikudService.deleteJuriidilineIsik(1L)).thenReturn(true);

        mockMvc.perform(get("/api/isikud/delete-juriidiline-isik?id=1"))
                .andExpect(status().isOk())
                .andExpect(content().string(containsString("successfully deleted")));

        verify(isikudService, times(1)).deleteJuriidilineIsik(1L);
    }

    @Test
    void getIsikudByYritusId_ShouldReturnAllIsikud() throws Exception {
        when(isikudService.getAllIsikudForYritus(1L)).thenReturn(allIsikudMap);

        mockMvc.perform(get("/api/isikud/get-isikud?yritusId=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fyysilisedIsikud", hasSize(1)))
                .andExpect(jsonPath("$.juriidilisedIsikud", hasSize(1)))
                .andExpect(jsonPath("$.fyysilisedIsikud[0].eesnimi", is("John")))
                .andExpect(jsonPath("$.juriidilisedIsikud[0].nimi", is("Test Company")));

        verify(isikudService, times(1)).getAllIsikudForYritus(1L);
    }

    @Test
    void updateFyysilineIsik_ShouldUpdateAndReturnIt() throws Exception {
        FyysilisedIsikud updatedIsik = new FyysilisedIsikud();
        updatedIsik.setId(1L);
        updatedIsik.setEesnimi("John Updated");
        updatedIsik.setPerekonnanimi("Doe Updated");
        updatedIsik.setIsikukood("38001085718");
        updatedIsik.setLisainfo("Updated test info");

        MaksmiseViisid updatedMaksmiseViis = new MaksmiseViisid();
        updatedMaksmiseViis.setId(2L);
        updatedMaksmiseViis.setMaksmiseViis("sularaha");
        updatedIsik.setMaksmiseViis(updatedMaksmiseViis);

        when(isikudService.updateFyysilineIsik(eq(1L), any(FyysilisedIsikud.class), eq("sularaha")))
                .thenReturn(updatedIsik);

        mockMvc.perform(post("/api/isikud/update-fyysiline-isik")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(fyysilineIsikUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.eesnimi", is("John Updated")))
                .andExpect(jsonPath("$.perekonnanimi", is("Doe Updated")))
                .andExpect(jsonPath("$.maksmiseViis.maksmiseViis", is("sularaha")));

        verify(isikudService, times(1)).updateFyysilineIsik(eq(1L), any(FyysilisedIsikud.class), eq("sularaha"));
    }

    @Test
    void updateJuriidilineIsik_ShouldUpdateAndReturnIt() throws Exception {
        JuriidilisedIsikud updatedIsik = new JuriidilisedIsikud();
        updatedIsik.setId(1L);
        updatedIsik.setNimi("Test Company Updated");
        updatedIsik.setRegistrikood("12345678");
        updatedIsik.setOsavotjateArv("7");
        updatedIsik.setLisainfo("Updated company test info");

        MaksmiseViisid updatedMaksmiseViis = new MaksmiseViisid();
        updatedMaksmiseViis.setId(2L);
        updatedMaksmiseViis.setMaksmiseViis("sularaha");
        updatedIsik.setMaksmiseViis(updatedMaksmiseViis);

        when(isikudService.updateJuriidilineIsik(eq(1L), any(JuriidilisedIsikud.class), eq("sularaha")))
                .thenReturn(updatedIsik);

        mockMvc.perform(post("/api/isikud/update-juriidiline-isik")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(juriidilineIsikUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nimi", is("Test Company Updated")))
                .andExpect(jsonPath("$.osavotjateArv", is("7")))
                .andExpect(jsonPath("$.maksmiseViis.maksmiseViis", is("sularaha")));

        verify(isikudService, times(1)).updateJuriidilineIsik(eq(1L), any(JuriidilisedIsikud.class), eq("sularaha"));
    }

    @Test
    void addFyysilineIsik_ShouldHandleExceptions() throws Exception {
        when(isikudService.addFyysilineIsikToYritus(any(FyysilisedIsikud.class), anyLong(), anyString()))
                .thenThrow(new RuntimeException("Error adding physical person"));

        mockMvc.perform(post("/api/isikud/add-fyysiline-isik")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(fyysilineIsikRequest)))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Failed to add physical person")));
    }

    @Test
    void updateFyysilineIsik_ShouldReturnBadRequestWhenIdMissing() throws Exception {
        fyysilineIsikUpdateRequest.setId(null);

        mockMvc.perform(post("/api/isikud/update-fyysiline-isik")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(fyysilineIsikUpdateRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("ID is required")));

        verify(isikudService, never()).updateFyysilineIsik(anyLong(), any(FyysilisedIsikud.class), anyString());
    }

    @Test
    void getFyysilineIsikById_ShouldReturnFyysilineIsik() throws Exception {
        when(isikudService.getFyysilineIsikById(1L)).thenReturn(testFyysilineIsik);

        mockMvc.perform(get("/api/isikud/get-fyysiline-isik?id=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.eesnimi", is("John")))
                .andExpect(jsonPath("$.perekonnanimi", is("Doe")))
                .andExpect(jsonPath("$.isikukood", is("38001085718")))
                .andExpect(jsonPath("$.maksmiseViis.maksmiseViis", is("pangaülekanne")));

        verify(isikudService, times(1)).getFyysilineIsikById(1L);
    }

    @Test
    void getFyysilineIsikById_ShouldReturnErrorWhenNotFound() throws Exception {
        when(isikudService.getFyysilineIsikById(999L))
                .thenThrow(new RuntimeException("Physical person with ID 999 not found"));

        mockMvc.perform(get("/api/isikud/get-fyysiline-isik?id=999"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Failed to retrieve physical person")));

        verify(isikudService, times(1)).getFyysilineIsikById(999L);
    }

    @Test
    void getJuriidilineIsikById_ShouldReturnJuriidilineIsik() throws Exception {
        when(isikudService.getJuriidilineIsikById(1L)).thenReturn(testJuriidilineIsik);

        mockMvc.perform(get("/api/isikud/get-juriidiline-isik?id=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(1)))
                .andExpect(jsonPath("$.nimi", is("Test Company")))
                .andExpect(jsonPath("$.registrikood", is("12345678")))
                .andExpect(jsonPath("$.osavotjateArv", is("5")))
                .andExpect(jsonPath("$.maksmiseViis.maksmiseViis", is("pangaülekanne")));

        verify(isikudService, times(1)).getJuriidilineIsikById(1L);
    }

    @Test
    void getJuriidilineIsikById_ShouldReturnError_WhenIsikNotFound() throws Exception {
        when(isikudService.getJuriidilineIsikById(999L))
                .thenThrow(new RuntimeException("Legal entity with ID 999 not found"));

        mockMvc.perform(get("/api/isikud/get-juriidiline-isik?id=999"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Failed to retrieve legal entity")));

        verify(isikudService, times(1)).getJuriidilineIsikById(999L);
    }

    @Test
    void getSaadavadIsikudByYritusId_ShouldReturnAvailableIsikud() throws Exception {
        Map<String, Object> availableIsikudMap = new HashMap<>();

        List<FyysilisedIsikud> availableFyysilisedIsikud = new ArrayList<>();
        FyysilisedIsikud availableFyysilineIsik = new FyysilisedIsikud();
        availableFyysilineIsik.setId(2L);
        availableFyysilineIsik.setEesnimi("Jane");
        availableFyysilineIsik.setPerekonnanimi("Smith");
        availableFyysilisedIsikud.add(availableFyysilineIsik);

        List<JuriidilisedIsikud> availableJuriidilisedIsikud = new ArrayList<>();
        JuriidilisedIsikud availableJuriidilineIsik = new JuriidilisedIsikud();
        availableJuriidilineIsik.setId(2L);
        availableJuriidilineIsik.setNimi("Another Company");
        availableJuriidilisedIsikud.add(availableJuriidilineIsik);

        availableIsikudMap.put("fyysilisedIsikud", availableFyysilisedIsikud);
        availableIsikudMap.put("juriidilisedIsikud", availableJuriidilisedIsikud);

        when(isikudService.getAvailableIsikudForYritus(1L)).thenReturn(availableIsikudMap);

        mockMvc.perform(get("/api/isikud/get-saadavad-isikud?yritusId=1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fyysilisedIsikud", hasSize(1)))
                .andExpect(jsonPath("$.juriidilisedIsikud", hasSize(1)))
                .andExpect(jsonPath("$.fyysilisedIsikud[0].eesnimi", is("Jane")))
                .andExpect(jsonPath("$.juriidilisedIsikud[0].nimi", is("Another Company")));

        verify(isikudService, times(1)).getAvailableIsikudForYritus(1L);
    }

    @Test
    void getSaadavadIsikudByYritusId_ShouldReturnError_WhenYritusNotFound() throws Exception {
        when(isikudService.getAvailableIsikudForYritus(999L))
                .thenThrow(new RuntimeException("Event with ID 999 not found"));

        mockMvc.perform(get("/api/isikud/get-saadavad-isikud?yritusId=999"))
                .andExpect(status().isInternalServerError())
                .andExpect(content().string(containsString("Failed to retrieve available people for event")));

        verify(isikudService, times(1)).getAvailableIsikudForYritus(999L);
    }
}
