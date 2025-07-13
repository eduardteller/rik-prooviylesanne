package com.rik.prooviylesanne.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rik.prooviylesanne.model.FyysilisedIsikud;
import com.rik.prooviylesanne.model.JuriidilisedIsikud;
import com.rik.prooviylesanne.service.IsikudService;

import lombok.Getter;
import lombok.Setter;

/**
 * Kontroller isikute (füüsilised ja juriidilised isikud) haldamiseks.
 * Võimaldab isikuid lisada, kustutada, muuta ja päringuid teha.
 */
@RestController
@RequestMapping("/api/isikud")
@CrossOrigin(origins = "*")
public class IsikudController {

    private final IsikudService isikudService;

    public IsikudController(IsikudService isikudService) {
        this.isikudService = isikudService;
    }

    /**
     * Päringu klass füüsilise isiku lisamiseks
     */
    @Setter
    @Getter
    public static class FyysilineIsikRequest {
        private String eesnimi;
        private String perekonnanimi;
        private String isikukood;
        private String maksmiseViis;
        private String lisainfo;
        private Long yritusId;
        private Long isikId; // Olemasoleva isiku ID, kui soovitakse lisada juba olemasolevat isikut
    }

    /**
     * Päringu klass juriidilise isiku lisamiseks
     */
    @Setter
    @Getter
    public static class JuriidilineIsikRequest {
        private String nimi;
        private String registrikood;
        private String osavotjateArv;
        private String maksmiseViis;
        private String lisainfo;
        private Long yritusId;
        private Long isikId; // Olemasoleva isiku ID, kui soovitakse lisada juba olemasolevat isikut
    }

    /**
     * Päringu klass füüsilise isiku muutmiseks
     */
    @Setter
    @Getter
    public static class FyysilineIsikUpdateRequest {
        private Long id;
        private String eesnimi;
        private String perekonnanimi;
        private String isikukood;
        private String maksmiseViis;
        private String lisainfo;
    }

    /**
     * Päringu klass juriidilise isiku muutmiseks
     */
    @Setter
    @Getter
    public static class JuriidilineIsikUpdateRequest {
        private Long id;
        private String nimi;
        private String registrikood;
        private String osavotjateArv;
        private String maksmiseViis;
        private String lisainfo;
    }

    /**
     * Lisab füüsilise isiku üritusele.
     * Kui isikId on määratud, siis lisab olemasoleva isiku, muul juhul loob uue.
     */
    @PostMapping("/add-fyysiline-isik")
    public ResponseEntity<?> addFyysilineIsik(@RequestBody FyysilineIsikRequest request) {
        try {
            FyysilisedIsikud savedIsik;

            // Kontrollime, kas soovitakse lisada olemasolevat isikut
            if (request.getIsikId() != null) {
                savedIsik = isikudService.addExistingFyysilineIsikToYritus(
                        request.getIsikId(),
                        request.getYritusId());
            } else {
                // Loome uue füüsilise isiku
                FyysilisedIsikud isik = new FyysilisedIsikud();
                isik.setEesnimi(request.getEesnimi());
                isik.setPerekonnanimi(request.getPerekonnanimi());
                isik.setIsikukood(request.getIsikukood());
                isik.setLisainfo(request.getLisainfo());

                savedIsik = isikudService.addFyysilineIsikToYritus(
                        isik,
                        request.getYritusId(),
                        request.getMaksmiseViis());
            }

            return ResponseEntity.ok(savedIsik);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add physical person: " + e.getMessage());
        }
    }

    /**
     * Lisab juriidilise isiku üritusele.
     * Kui isikId on määratud, siis lisab olemasoleva isiku, muul juhul loob uue.
     */
    @PostMapping("/add-juriidiline-isik")
    public ResponseEntity<?> addJuriidilineIsik(@RequestBody JuriidilineIsikRequest request) {
        try {
            JuriidilisedIsikud savedIsik;

            // Kontrollime, kas soovitakse lisada olemasolevat isikut
            if (request.getIsikId() != null) {
                savedIsik = isikudService.addExistingJuriidilineIsikToYritus(
                        request.getIsikId(),
                        request.getYritusId());
            } else {
                // Loome uue juriidilise isiku
                JuriidilisedIsikud isik = new JuriidilisedIsikud();
                isik.setNimi(request.getNimi());
                isik.setRegistrikood(request.getRegistrikood());
                isik.setOsavotjateArv(request.getOsavotjateArv());
                isik.setLisainfo(request.getLisainfo());

                savedIsik = isikudService.addJuriidilineIsikToYritus(
                        isik,
                        request.getYritusId(),
                        request.getMaksmiseViis());
            }

            return ResponseEntity.ok(savedIsik);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add legal entity: " + e.getMessage());
        }
    }

    /**
     * Kustutab füüsilise isiku ID järgi
     */
    @GetMapping("/delete-fyysiline-isik")
    public ResponseEntity<?> deleteFyysilineIsik(@RequestParam Long id) {
        try {
            boolean deleted = isikudService.deleteFyysilineIsik(id);
            if (deleted) {
                return ResponseEntity.ok("Physical person with ID " + id + " has been successfully deleted");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Physical person with ID " + id + " not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete physical person: " + e.getMessage());
        }
    }

    /**
     * Kustutab juriidilise isiku ID järgi
     */
    @GetMapping("/delete-juriidiline-isik")
    public ResponseEntity<?> deleteJuriidilineIsik(@RequestParam Long id) {
        try {
            boolean deleted = isikudService.deleteJuriidilineIsik(id);
            if (deleted) {
                return ResponseEntity.ok("Legal entity with ID " + id + " has been successfully deleted");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Legal entity with ID " + id + " not found");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to delete legal entity: " + e.getMessage());
        }
    }

    /**
     * Tagastab kõik üritusega seotud isikud (nii füüsilised kui juriidilised)
     */
    @GetMapping("/get-isikud")
    public ResponseEntity<?> getIsikudByYritusId(@RequestParam Long yritusId) {
        try {
            Map<String, Object> isikud = isikudService.getAllIsikudForYritus(yritusId);
            return ResponseEntity.ok(isikud);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve people for event: " + e.getMessage());
        }
    }

    /**
     * Uuendab füüsilise isiku andmeid
     */
    @PostMapping("/update-fyysiline-isik")
    public ResponseEntity<?> updateFyysilineIsik(@RequestBody FyysilineIsikUpdateRequest request) {
        try {
            if (request.getId() == null) {
                return ResponseEntity.badRequest().body("ID is required for updating a physical person");
            }

            // Loome uuendatava isiku objekti
            FyysilisedIsikud isikToUpdate = new FyysilisedIsikud();
            isikToUpdate.setEesnimi(request.getEesnimi());
            isikToUpdate.setPerekonnanimi(request.getPerekonnanimi());
            isikToUpdate.setIsikukood(request.getIsikukood());
            isikToUpdate.setLisainfo(request.getLisainfo());

            FyysilisedIsikud updatedIsik = isikudService.updateFyysilineIsik(
                    request.getId(),
                    isikToUpdate,
                    request.getMaksmiseViis());

            return ResponseEntity.ok(updatedIsik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update physical person: " + e.getMessage());
        }
    }

    /**
     * Uuendab juriidilise isiku andmeid
     */
    @PostMapping("/update-juriidiline-isik")
    public ResponseEntity<?> updateJuriidilineIsik(@RequestBody JuriidilineIsikUpdateRequest request) {
        try {
            if (request.getId() == null) {
                return ResponseEntity.badRequest().body("ID is required for updating a legal entity");
            }

            // Loome uuendatava isiku objekti
            JuriidilisedIsikud isikToUpdate = new JuriidilisedIsikud();
            isikToUpdate.setNimi(request.getNimi());
            isikToUpdate.setRegistrikood(request.getRegistrikood());
            isikToUpdate.setOsavotjateArv(request.getOsavotjateArv());
            isikToUpdate.setLisainfo(request.getLisainfo());

            JuriidilisedIsikud updatedIsik = isikudService.updateJuriidilineIsik(
                    request.getId(),
                    isikToUpdate,
                    request.getMaksmiseViis());

            return ResponseEntity.ok(updatedIsik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update legal entity: " + e.getMessage());
        }
    }

    /**
     * Tagastab füüsilise isiku andmed ID järgi
     */
    @GetMapping("/get-fyysiline-isik")
    public ResponseEntity<?> getFyysilineIsikById(@RequestParam Long id) {
        try {
            FyysilisedIsikud isik = isikudService.getFyysilineIsikById(id);
            return ResponseEntity.ok(isik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve physical person: " + e.getMessage());
        }
    }

    /**
     * Tagastab juriidilise isiku andmed ID järgi
     */
    @GetMapping("/get-juriidiline-isik")
    public ResponseEntity<?> getJuriidilineIsikById(@RequestParam Long id) {
        try {
            JuriidilisedIsikud isik = isikudService.getJuriidilineIsikById(id);
            return ResponseEntity.ok(isik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve legal entity: " + e.getMessage());
        }
    }

    /**
     * Tagastab kõik saadaolevad isikud, keda saab üritusele lisada
     * (isikud, kes veel pole selle üritusega seotud)
     */
    @GetMapping("/get-saadavad-isikud")
    public ResponseEntity<?> getSaadavadIsikudByYritusId(@RequestParam Long yritusId) {
        try {
            Map<String, Object> saadavadIsikud = isikudService.getAvailableIsikudForYritus(yritusId);
            return ResponseEntity.ok(saadavadIsikud);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve available people for event: " + e.getMessage());
        }
    }
}
