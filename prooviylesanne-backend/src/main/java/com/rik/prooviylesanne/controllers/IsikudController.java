package com.rik.prooviylesanne.controllers;

import com.rik.prooviylesanne.model.FyysilisedIsikud;
import com.rik.prooviylesanne.model.JuriidilisedIsikud;
import com.rik.prooviylesanne.model.MaksmiseViisid;
import com.rik.prooviylesanne.service.IsikudService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/isikud")
@CrossOrigin(origins = "*")
public class IsikudController {

    private final IsikudService isikudService;

    @Autowired
    public IsikudController(IsikudService isikudService) {
        this.isikudService = isikudService;
    }

    @Setter
    @Getter
    public static class FyysilineIsikRequest {
        private String eesnimi;
        private String perekonnanimi;
        private String isikukood;
        private String maksmiseViis;
        private String lisainfo;
        private Long yritusId;
    }

    @Setter
    @Getter
    public static class JuriidilineIsikRequest {
        private String nimi;
        private String registrikood;
        private String osavotjateArv;
        private String maksmiseViis;
        private String lisainfo;
        private Long yritusId;
    }

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

    @PostMapping("/add-fyysiline-isik")
    public ResponseEntity<?> addFyysilineIsik(@RequestBody FyysilineIsikRequest request) {
        try {
            FyysilisedIsikud isik = new FyysilisedIsikud();
            isik.setEesnimi(request.getEesnimi());
            isik.setPerekonnanimi(request.getPerekonnanimi());
            isik.setIsikukood(request.getIsikukood());
            isik.setLisainfo(request.getLisainfo());

            // Let the service handle finding the payment method
            FyysilisedIsikud savedIsik = isikudService.addFyysilineIsikToYritus(
                    isik,
                    request.getYritusId(),
                    request.getMaksmiseViis()
            );

            return ResponseEntity.ok(savedIsik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add physical person: " + e.getMessage());
        }
    }

    @PostMapping("/add-juriidiline-isik")
    public ResponseEntity<?> addJuriidilineIsik(@RequestBody JuriidilineIsikRequest request) {
        try {
            JuriidilisedIsikud isik = new JuriidilisedIsikud();
            isik.setNimi(request.getNimi());
            isik.setRegistrikood(request.getRegistrikood());
            isik.setOsavotjateArv(request.getOsavotjateArv());
            isik.setLisainfo(request.getLisainfo());

            // Let the service handle finding the payment method
            JuriidilisedIsikud savedIsik = isikudService.addJuriidilineIsikToYritus(
                    isik,
                    request.getYritusId(),
                    request.getMaksmiseViis()
            );

            return ResponseEntity.ok(savedIsik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add legal entity: " + e.getMessage());
        }
    }

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

    @PostMapping("/update-fyysiline-isik")
    public ResponseEntity<?> updateFyysilineIsik(@RequestBody FyysilineIsikUpdateRequest request) {
        try {
            if (request.getId() == null) {
                return ResponseEntity.badRequest().body("ID is required for updating a physical person");
            }

            FyysilisedIsikud isikToUpdate = new FyysilisedIsikud();
            isikToUpdate.setEesnimi(request.getEesnimi());
            isikToUpdate.setPerekonnanimi(request.getPerekonnanimi());
            isikToUpdate.setIsikukood(request.getIsikukood());
            isikToUpdate.setLisainfo(request.getLisainfo());

            FyysilisedIsikud updatedIsik = isikudService.updateFyysilineIsik(
                    request.getId(),
                    isikToUpdate,
                    request.getMaksmiseViis()
            );

            return ResponseEntity.ok(updatedIsik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update physical person: " + e.getMessage());
        }
    }

    @PostMapping("/update-juriidiline-isik")
    public ResponseEntity<?> updateJuriidilineIsik(@RequestBody JuriidilineIsikUpdateRequest request) {
        try {
            if (request.getId() == null) {
                return ResponseEntity.badRequest().body("ID is required for updating a legal entity");
            }

            JuriidilisedIsikud isikToUpdate = new JuriidilisedIsikud();
            isikToUpdate.setNimi(request.getNimi());
            isikToUpdate.setRegistrikood(request.getRegistrikood());
            isikToUpdate.setOsavotjateArv(request.getOsavotjateArv());
            isikToUpdate.setLisainfo(request.getLisainfo());

            JuriidilisedIsikud updatedIsik = isikudService.updateJuriidilineIsik(
                    request.getId(),
                    isikToUpdate,
                    request.getMaksmiseViis()
            );

            return ResponseEntity.ok(updatedIsik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to update legal entity: " + e.getMessage());
        }
    }

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
}
