package com.rik.prooviylesanne.controllers;

import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.service.YritusedService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;
import java.util.List;

@RestController
public class YritusedController {

    private final YritusedService yritusedService;

    @Autowired
    public YritusedController(YritusedService yritusedService) {
        this.yritusedService = yritusedService;
    }

    @Setter
    @Getter
    public static class YritusRequest {
        private String nimi;
        private OffsetDateTime aeg;
        private String koht;
        private String lisainfo;
    }

    @PostMapping("/add-yritus")
    public ResponseEntity<?> addYritus(@RequestBody YritusRequest request) {
        try {
            Yritused yritus = new Yritused();
            yritus.setNimi(request.getNimi());
            yritus.setAeg(request.getAeg());
            yritus.setKoht(request.getKoht());
            yritus.setLisainfo(request.getLisainfo());

            Yritused savedYritus = yritusedService.saveYritus(yritus);
            return ResponseEntity.ok(savedYritus);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add event: " + e.getMessage());
        }
    }

    @GetMapping("/get-yritused")
    public ResponseEntity<?> getAllYritused() {
        try {
            List<Yritused> yritused = yritusedService.getAllYritused();
            return ResponseEntity.ok(yritused);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve events: " + e.getMessage());
        }
    }

    @GetMapping("/delete-yritus")
    public ResponseEntity<?> deleteYritus(@RequestParam Long id) {
        try {
            boolean deleted = yritusedService.deleteYritusWithRelatedRecords(id);

            if (deleted) {
                return ResponseEntity.ok("Event with ID " + id + " and all related records have been deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Event with ID " + id + " not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
