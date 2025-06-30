package com.rik.prooviylesanne.service;

import com.rik.prooviylesanne.model.*;
import com.rik.prooviylesanne.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

public class IsikudServiceTests {

    @Mock
    private FyysilisedIsikudRepository fyysilisedIsikudRepository;

    @Mock
    private JuriidilisedIsikudRepository juriidilisedIsikudRepository;

    @Mock
    private YritusedRepository yritusedRepository;

    @Mock
    private YritusedIsikudRepository yritusedIsikudRepository;

    @Mock
    private MaksmiseViisidRepository maksmiseViisidRepository;

    @InjectMocks
    private IsikudService isikudService;

    private Yritused testYritus;
    private FyysilisedIsikud testFyysilineIsik;
    private JuriidilisedIsikud testJuriidilineIsik;
    private MaksmiseViisid testMaksmiseViis;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testYritus = new Yritused();
        testYritus.setId(1L);
        testYritus.setNimi("Test Event");
        testYritus.setAeg(OffsetDateTime.of(2025, 12, 31, 23, 59, 0, 0, ZoneOffset.UTC));
        testYritus.setKoht("Test Location");
        testYritus.setLisainfo("Test Info");

        testMaksmiseViis = new MaksmiseViisid();
        testMaksmiseViis.setId(1L);
        testMaksmiseViis.setMaksmiseViis("pangaülekanne");

        testFyysilineIsik = new FyysilisedIsikud();
        testFyysilineIsik.setId(1L);
        testFyysilineIsik.setEesnimi("John");
        testFyysilineIsik.setPerekonnanimi("Doe");
        testFyysilineIsik.setIsikukood("38001085718");
        testFyysilineIsik.setLisainfo("Test info");
        testFyysilineIsik.setMaksmiseViis(testMaksmiseViis);

        testJuriidilineIsik = new JuriidilisedIsikud();
        testJuriidilineIsik.setId(1L);
        testJuriidilineIsik.setNimi("Test Company");
        testJuriidilineIsik.setRegistrikood("12345678");
        testJuriidilineIsik.setOsavotjateArv("5");
        testJuriidilineIsik.setLisainfo("Company test info");
        testJuriidilineIsik.setMaksmiseViis(testMaksmiseViis);
    }

    @Test
    void addFyysilineIsikToYritus_ShouldAddPersonToEvent() {
        // Setup
        when(yritusedRepository.findById(1L)).thenReturn(Optional.of(testYritus));
        when(maksmiseViisidRepository.findByMaksmiseViis("pangaülekanne"))
                .thenReturn(Optional.of(testMaksmiseViis));
        when(fyysilisedIsikudRepository.save(any(FyysilisedIsikud.class))).thenReturn(testFyysilineIsik);

        // Test
        FyysilisedIsikud result = isikudService.addFyysilineIsikToYritus(
                testFyysilineIsik, 1L, "pangaülekanne");

        // Verify
        assertNotNull(result);
        assertEquals(testFyysilineIsik.getId(), result.getId());
        assertEquals(testFyysilineIsik.getEesnimi(), result.getEesnimi());
        assertEquals(testFyysilineIsik.getIsikukood(), result.getIsikukood());
        assertEquals(testFyysilineIsik.getMaksmiseViis().getMaksmiseViis(), result.getMaksmiseViis().getMaksmiseViis());

        verify(yritusedRepository, times(1)).findById(1L);
        verify(maksmiseViisidRepository, times(1)).findByMaksmiseViis("pangaülekanne");
        verify(fyysilisedIsikudRepository, times(1)).save(any(FyysilisedIsikud.class));
        verify(yritusedIsikudRepository, times(1)).save(any(YritusedIsikud.class));
    }

    @Test
    void addFyysilineIsikToYritus_ShouldThrowWhenEventNotFound() {
        // Setup
        when(yritusedRepository.findById(999L)).thenReturn(Optional.empty());

        // Test & verify
        Exception exception = assertThrows(RuntimeException.class, () ->
            isikudService.addFyysilineIsikToYritus(testFyysilineIsik, 999L, "pangaülekanne")
        );

        assertTrue(exception.getMessage().contains("not found"));
        verify(yritusedRepository, times(1)).findById(999L);
        verify(maksmiseViisidRepository, never()).findByMaksmiseViis(anyString());
        verify(fyysilisedIsikudRepository, never()).save(any(FyysilisedIsikud.class));
    }

    @Test
    void addJuriidilineIsikToYritus_ShouldAddCompanyToEvent() {
        // Setup
        when(yritusedRepository.findById(1L)).thenReturn(Optional.of(testYritus));
        when(maksmiseViisidRepository.findByMaksmiseViis("pangaülekanne"))
                .thenReturn(Optional.of(testMaksmiseViis));
        when(juriidilisedIsikudRepository.save(any(JuriidilisedIsikud.class))).thenReturn(testJuriidilineIsik);

        // Test
        JuriidilisedIsikud result = isikudService.addJuriidilineIsikToYritus(
                testJuriidilineIsik, 1L, "pangaülekanne");

        // Verify
        assertNotNull(result);
        assertEquals(testJuriidilineIsik.getId(), result.getId());
        assertEquals(testJuriidilineIsik.getNimi(), result.getNimi());
        assertEquals(testJuriidilineIsik.getRegistrikood(), result.getRegistrikood());
        assertEquals(testJuriidilineIsik.getOsavotjateArv(), result.getOsavotjateArv());

        verify(yritusedRepository, times(1)).findById(1L);
        verify(maksmiseViisidRepository, times(1)).findByMaksmiseViis("pangaülekanne");
        verify(juriidilisedIsikudRepository, times(1)).save(any(JuriidilisedIsikud.class));
        verify(yritusedIsikudRepository, times(1)).save(any(YritusedIsikud.class));
    }

    @Test
    void deleteFyysilineIsik_ShouldDeleteWhenExists() {
        // Setup
        when(fyysilisedIsikudRepository.findById(1L)).thenReturn(Optional.of(testFyysilineIsik));
        doNothing().when(yritusedIsikudRepository).deleteByFyysilineIsikId(testFyysilineIsik);
        doNothing().when(fyysilisedIsikudRepository).delete(testFyysilineIsik);

        // Test
        boolean result = isikudService.deleteFyysilineIsik(1L);

        // Verify
        assertTrue(result);
        verify(fyysilisedIsikudRepository, times(1)).findById(1L);
        verify(yritusedIsikudRepository, times(1)).deleteByFyysilineIsikId(testFyysilineIsik);
        verify(fyysilisedIsikudRepository, times(1)).delete(testFyysilineIsik);
    }

    @Test
    void deleteJuriidilineIsik_ShouldDeleteWhenExists() {
        // Setup
        when(juriidilisedIsikudRepository.findById(1L)).thenReturn(Optional.of(testJuriidilineIsik));
        doNothing().when(yritusedIsikudRepository).deleteByJuriidilineIsikId(testJuriidilineIsik);
        doNothing().when(juriidilisedIsikudRepository).delete(testJuriidilineIsik);

        // Test
        boolean result = isikudService.deleteJuriidilineIsik(1L);

        // Verify
        assertTrue(result);
        verify(juriidilisedIsikudRepository, times(1)).findById(1L);
        verify(yritusedIsikudRepository, times(1)).deleteByJuriidilineIsikId(testJuriidilineIsik);
        verify(juriidilisedIsikudRepository, times(1)).delete(testJuriidilineIsik);
    }

    @Test
    void getAllIsikudForYritus_ShouldReturnIsikudForYritus() {
        // Setup
        when(yritusedRepository.findById(1L)).thenReturn(Optional.of(testYritus));

        List<YritusedIsikud> yritusedIsikudList = new ArrayList<>();
        YritusedIsikud fyysilineEntry = new YritusedIsikud();
        fyysilineEntry.setYritus(testYritus);
        fyysilineEntry.setFyysilineIsikId(testFyysilineIsik);

        YritusedIsikud juriidilineEntry = new YritusedIsikud();
        juriidilineEntry.setYritus(testYritus);
        juriidilineEntry.setJuriidilineIsikId(testJuriidilineIsik);

        yritusedIsikudList.add(fyysilineEntry);
        yritusedIsikudList.add(juriidilineEntry);

        when(yritusedIsikudRepository.findByYritus(testYritus)).thenReturn(yritusedIsikudList);

        // Test
        Map<String, Object> result = isikudService.getAllIsikudForYritus(1L);

        // Verify
        assertNotNull(result);
        assertTrue(result.containsKey("fyysilisedIsikud"));
        assertTrue(result.containsKey("juriidilisedIsikud"));

        List<FyysilisedIsikud> fyysilised = (List<FyysilisedIsikud>) result.get("fyysilisedIsikud");
        List<JuriidilisedIsikud> juriidilised = (List<JuriidilisedIsikud>) result.get("juriidilisedIsikud");

        assertEquals(1, fyysilised.size());
        assertEquals(1, juriidilised.size());
        assertEquals(testFyysilineIsik.getId(), fyysilised.get(0).getId());
        assertEquals(testJuriidilineIsik.getId(), juriidilised.get(0).getId());

        verify(yritusedRepository, times(1)).findById(1L);
        verify(yritusedIsikudRepository, times(1)).findByYritus(testYritus);
    }

    @Test
    void updateFyysilineIsik_ShouldUpdateWhenExists() {
        // Setup
        FyysilisedIsikud existingIsik = new FyysilisedIsikud();
        existingIsik.setId(1L);
        existingIsik.setEesnimi("Old Name");
        existingIsik.setPerekonnanimi("Old Surname");
        existingIsik.setIsikukood("38001085718");
        existingIsik.setMaksmiseViis(testMaksmiseViis);

        FyysilisedIsikud updatedDetails = new FyysilisedIsikud();
        updatedDetails.setEesnimi("New Name");
        updatedDetails.setPerekonnanimi("New Surname");
        updatedDetails.setIsikukood("38001085718");
        updatedDetails.setLisainfo("Updated info");

        when(fyysilisedIsikudRepository.findById(1L)).thenReturn(Optional.of(existingIsik));

        // Create a MaksmiseViisid object with setters instead of constructor
        MaksmiseViisid sularahaMaksmiseViis = new MaksmiseViisid();
        sularahaMaksmiseViis.setId(2L);
        sularahaMaksmiseViis.setMaksmiseViis("sularaha");

        when(maksmiseViisidRepository.findByMaksmiseViis("sularaha"))
                .thenReturn(Optional.of(sularahaMaksmiseViis));
        when(fyysilisedIsikudRepository.save(any(FyysilisedIsikud.class))).thenAnswer(i -> i.getArguments()[0]);

        // Test
        FyysilisedIsikud result = isikudService.updateFyysilineIsik(1L, updatedDetails, "sularaha");

        // Verify
        assertNotNull(result);
        assertEquals("New Name", result.getEesnimi());
        assertEquals("New Surname", result.getPerekonnanimi());
        assertEquals("Updated info", result.getLisainfo());
        assertEquals("38001085718", result.getIsikukood());
        assertEquals("sularaha", result.getMaksmiseViis().getMaksmiseViis());

        verify(fyysilisedIsikudRepository, times(1)).findById(1L);
        verify(maksmiseViisidRepository, times(1)).findByMaksmiseViis("sularaha");
        verify(fyysilisedIsikudRepository, times(1)).save(any(FyysilisedIsikud.class));
    }

    @Test
    void updateJuriidilineIsik_ShouldUpdateWhenExists() {
        // Setup
        JuriidilisedIsikud existingIsik = new JuriidilisedIsikud();
        existingIsik.setId(1L);
        existingIsik.setNimi("Old Company");
        existingIsik.setRegistrikood("12345678");
        existingIsik.setOsavotjateArv("3");
        existingIsik.setMaksmiseViis(testMaksmiseViis);

        JuriidilisedIsikud updatedDetails = new JuriidilisedIsikud();
        updatedDetails.setNimi("New Company");
        updatedDetails.setRegistrikood("12345678");
        updatedDetails.setOsavotjateArv("5");
        updatedDetails.setLisainfo("Updated company info");

        when(juriidilisedIsikudRepository.findById(1L)).thenReturn(Optional.of(existingIsik));

        // Create a MaksmiseViisid object with setters instead of constructor
        MaksmiseViisid sularahaMaksmiseViis = new MaksmiseViisid();
        sularahaMaksmiseViis.setId(2L);
        sularahaMaksmiseViis.setMaksmiseViis("sularaha");

        when(maksmiseViisidRepository.findByMaksmiseViis("sularaha"))
                .thenReturn(Optional.of(sularahaMaksmiseViis));
        when(juriidilisedIsikudRepository.save(any(JuriidilisedIsikud.class))).thenAnswer(i -> i.getArguments()[0]);

        // Test
        JuriidilisedIsikud result = isikudService.updateJuriidilineIsik(1L, updatedDetails, "sularaha");

        // Verify
        assertNotNull(result);
        assertEquals("New Company", result.getNimi());
        assertEquals("12345678", result.getRegistrikood());
        assertEquals("5", result.getOsavotjateArv());
        assertEquals("Updated company info", result.getLisainfo());
        assertEquals("sularaha", result.getMaksmiseViis().getMaksmiseViis());

        verify(juriidilisedIsikudRepository, times(1)).findById(1L);
        verify(maksmiseViisidRepository, times(1)).findByMaksmiseViis("sularaha");
        verify(juriidilisedIsikudRepository, times(1)).save(any(JuriidilisedIsikud.class));
    }

    @Test
    void getFyysilineIsikById_ShouldReturnIsikWhenFound() {
        // Setup
        when(fyysilisedIsikudRepository.findById(1L)).thenReturn(Optional.of(testFyysilineIsik));

        // Test
        FyysilisedIsikud result = isikudService.getFyysilineIsikById(1L);

        // Verify
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("John", result.getEesnimi());
        assertEquals("Doe", result.getPerekonnanimi());
        assertEquals("38001085718", result.getIsikukood());

        verify(fyysilisedIsikudRepository, times(1)).findById(1L);
    }

    @Test
    void getFyysilineIsikById_ShouldThrowExceptionWhenNotFound() {
        // Setup
        when(fyysilisedIsikudRepository.findById(999L)).thenReturn(Optional.empty());

        // Test & Verify
        RuntimeException exception = assertThrows(RuntimeException.class,
            () -> isikudService.getFyysilineIsikById(999L));

        assertEquals("Physical person with ID 999 not found", exception.getMessage());
        verify(fyysilisedIsikudRepository, times(1)).findById(999L);
    }

    @Test
    void getJuriidilineIsikById_ShouldReturnJuriidilineIsik() {
        // Setup
        when(juriidilisedIsikudRepository.findById(1L)).thenReturn(Optional.of(testJuriidilineIsik));

        // Test
        JuriidilisedIsikud result = isikudService.getJuriidilineIsikById(1L);

        // Verify
        assertNotNull(result);
        assertEquals(testJuriidilineIsik.getId(), result.getId());
        assertEquals(testJuriidilineIsik.getNimi(), result.getNimi());
        assertEquals(testJuriidilineIsik.getRegistrikood(), result.getRegistrikood());
        assertEquals(testJuriidilineIsik.getOsavotjateArv(), result.getOsavotjateArv());
        assertEquals(testJuriidilineIsik.getLisainfo(), result.getLisainfo());
        assertEquals(testJuriidilineIsik.getMaksmiseViis().getMaksmiseViis(), result.getMaksmiseViis().getMaksmiseViis());

        verify(juriidilisedIsikudRepository, times(1)).findById(1L);
    }

    @Test
    void getJuriidilineIsikById_ShouldThrowException_WhenJuriidilineIsikNotFound() {
        // Setup
        when(juriidilisedIsikudRepository.findById(999L)).thenReturn(Optional.empty());

        // Test & Verify
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            isikudService.getJuriidilineIsikById(999L);
        });

        assertEquals("Legal entity with ID 999 not found", thrown.getMessage());
        verify(juriidilisedIsikudRepository, times(1)).findById(999L);
    }

    @Test
    void getAllIsikudForYritus_ShouldReturnBothIsikudLists() {
        // Setup
        YritusedIsikud fyysilineYritusIsik = new YritusedIsikud();
        fyysilineYritusIsik.setYritus(testYritus);
        fyysilineYritusIsik.setFyysilineIsikId(testFyysilineIsik);

        YritusedIsikud juriidilineYritusIsik = new YritusedIsikud();
        juriidilineYritusIsik.setYritus(testYritus);
        juriidilineYritusIsik.setJuriidilineIsikId(testJuriidilineIsik);

        List<YritusedIsikud> yritusedIsikud = List.of(fyysilineYritusIsik, juriidilineYritusIsik);

        when(yritusedRepository.findById(1L)).thenReturn(Optional.of(testYritus));
        when(yritusedIsikudRepository.findByYritus(testYritus)).thenReturn(yritusedIsikud);

        // Test
        Map<String, Object> result = isikudService.getAllIsikudForYritus(1L);

        // Verify
        assertNotNull(result);
        assertTrue(result.containsKey("fyysilisedIsikud"));
        assertTrue(result.containsKey("juriidilisedIsikud"));

        List<FyysilisedIsikud> resultFyysilised = (List<FyysilisedIsikud>) result.get("fyysilisedIsikud");
        List<JuriidilisedIsikud> resultJuriidilised = (List<JuriidilisedIsikud>) result.get("juriidilisedIsikud");

        assertEquals(1, resultFyysilised.size());
        assertEquals(1, resultJuriidilised.size());

        assertEquals(testFyysilineIsik.getId(), resultFyysilised.get(0).getId());
        assertEquals(testJuriidilineIsik.getId(), resultJuriidilised.get(0).getId());

        verify(yritusedRepository, times(1)).findById(1L);
        verify(yritusedIsikudRepository, times(1)).findByYritus(testYritus);
    }

    @Test
    void getAllIsikudForYritus_ShouldThrowException_WhenYritusNotFound() {
        // Setup
        when(yritusedRepository.findById(999L)).thenReturn(Optional.empty());

        // Test & Verify
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            isikudService.getAllIsikudForYritus(999L);
        });

        assertEquals("Event with ID 999 not found", thrown.getMessage());
        verify(yritusedRepository, times(1)).findById(999L);
    }

    @Test
    void getAvailableIsikudForYritus_ShouldReturnAvailableIsikud() {
        // Setup
        YritusedIsikud existingFyysilineYritusIsik = new YritusedIsikud();
        existingFyysilineYritusIsik.setYritus(testYritus);
        existingFyysilineYritusIsik.setFyysilineIsikId(testFyysilineIsik);

        YritusedIsikud existingJuriidilineYritusIsik = new YritusedIsikud();
        existingJuriidilineYritusIsik.setYritus(testYritus);
        existingJuriidilineYritusIsik.setJuriidilineIsikId(testJuriidilineIsik);

        List<YritusedIsikud> existingYritusedIsikud = List.of(existingFyysilineYritusIsik, existingJuriidilineYritusIsik);

        FyysilisedIsikud availableFyysilineIsik = new FyysilisedIsikud();
        availableFyysilineIsik.setId(2L);
        availableFyysilineIsik.setEesnimi("Jane");
        availableFyysilineIsik.setPerekonnanimi("Smith");

        JuriidilisedIsikud availableJuriidilineIsik = new JuriidilisedIsikud();
        availableJuriidilineIsik.setId(2L);
        availableJuriidilineIsik.setNimi("Another Company");

        List<FyysilisedIsikud> allFyysilisedIsikud = List.of(testFyysilineIsik, availableFyysilineIsik);
        List<JuriidilisedIsikud> allJuriidilisedIsikud = List.of(testJuriidilineIsik, availableJuriidilineIsik);

        when(yritusedRepository.findById(1L)).thenReturn(Optional.of(testYritus));
        when(yritusedIsikudRepository.findByYritus(testYritus)).thenReturn(existingYritusedIsikud);
        when(fyysilisedIsikudRepository.findAll()).thenReturn(allFyysilisedIsikud);
        when(juriidilisedIsikudRepository.findAll()).thenReturn(allJuriidilisedIsikud);

        // Test
        Map<String, Object> result = isikudService.getAvailableIsikudForYritus(1L);

        // Verify
        assertNotNull(result);
        assertTrue(result.containsKey("fyysilisedIsikud"));
        assertTrue(result.containsKey("juriidilisedIsikud"));

        List<FyysilisedIsikud> resultFyysilised = (List<FyysilisedIsikud>) result.get("fyysilisedIsikud");
        List<JuriidilisedIsikud> resultJuriidilised = (List<JuriidilisedIsikud>) result.get("juriidilisedIsikud");

        assertEquals(1, resultFyysilised.size());
        assertEquals(1, resultJuriidilised.size());

        assertEquals(availableFyysilineIsik.getId(), resultFyysilised.get(0).getId());
        assertEquals(availableFyysilineIsik.getEesnimi(), resultFyysilised.get(0).getEesnimi());
        assertEquals(availableJuriidilineIsik.getId(), resultJuriidilised.get(0).getId());
        assertEquals(availableJuriidilineIsik.getNimi(), resultJuriidilised.get(0).getNimi());

        verify(yritusedRepository, times(1)).findById(1L);
        verify(yritusedIsikudRepository, times(1)).findByYritus(testYritus);
        verify(fyysilisedIsikudRepository, times(1)).findAll();
        verify(juriidilisedIsikudRepository, times(1)).findAll();
    }

    @Test
    void getAvailableIsikudForYritus_ShouldThrowException_WhenYritusNotFound() {
        // Setup
        when(yritusedRepository.findById(999L)).thenReturn(Optional.empty());

        // Test & Verify
        RuntimeException thrown = assertThrows(RuntimeException.class, () -> {
            isikudService.getAvailableIsikudForYritus(999L);
        });

        assertEquals("Event with ID 999 not found", thrown.getMessage());
        verify(yritusedRepository, times(1)).findById(999L);
    }
}
