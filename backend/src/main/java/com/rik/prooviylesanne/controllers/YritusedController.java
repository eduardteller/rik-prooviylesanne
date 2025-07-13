package com.rik.prooviylesanne.controllers;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.rik.prooviylesanne.dto.YritusedDto;
import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.service.YritusedService;

import lombok.Getter;
import lombok.Setter;

/**
 * Ürituste haldamise kontroller
 * Vastutab ürituste loomise, kuvamise ja kustutamise eest
 */
@RestController
@CrossOrigin(origins = "*")
public class YritusedController {

    private final YritusedService yritusedService;

    public YritusedController(YritusedService yritusedService) {
        this.yritusedService = yritusedService;
    }

    /**
     * Ürituse andmete saatmiseks vajalik klass
     */
    @Setter
    @Getter
    public static class YritusRequest {
        private String nimi;
        private OffsetDateTime aeg;
        private String koht;
        private String lisainfo;
    }

    /**
     * Uue ürituse lisamine
     * Kontrollib, et üritus ei ole minevikus ja salvestab selle andmebaasi
     */
    @PostMapping("/add-yritus")
    public ResponseEntity<?> addYritus(@RequestBody YritusRequest request) {
        try {
            // Loome uue ürituse objekti ja täidame selle andmetega
            Yritused yritus = new Yritused();
            yritus.setNimi(request.getNimi());
            yritus.setAeg(request.getAeg());
            yritus.setKoht(request.getKoht());
            yritus.setLisainfo(request.getLisainfo());

            // Salvestame ürituse andmebaasi
            Yritused savedYritus = yritusedService.saveYritus(yritus);
            return ResponseEntity.ok(savedYritus);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add event: " + e.getMessage());
        }
    }

    /**
     * Ürituste leidmine ja kuvamine
     * Kui ID on antud, tagastab ühe ürituse, muidu kõik üritused
     * Kaasab ka osalejate arvu
     */
    @GetMapping("/get-yritused")
    public ResponseEntity<?> getAllYritusedWithCount(@RequestParam(required = false) Long id) {
        try {
            if (id != null) {
                // Otsime konkreetset üritust ID järgi
                Optional<YritusedDto> yritusDto = yritusedService.getYritusDtoById(id);
                if (yritusDto.isPresent()) {
                    return ResponseEntity.ok(yritusDto.get());
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body(new YritusedDto()); // Return empty DTO instead of String
                }
            } else {
                // Tagastame kõik üritused koos osalejate arvuga
                List<YritusedDto> yritusedDtos = yritusedService.getAllYritusedAsDto();
                return ResponseEntity.ok(yritusedDtos);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to retrieve events: " + e.getMessage());
        }
    }

    /**
     * Ürituse kustutamine
     * Kustutab ürituse ja kõik sellega seotud andmed
     * Ei luba kustutada minevikus toimunud üritusi
     */
    @GetMapping("/delete-yritus")
    public ResponseEntity<?> deleteYritus(@RequestParam Long id) {
        try {
            boolean deleted = yritusedService.deleteYritusWithRelatedRecords(id);

            if (deleted) {
                return ResponseEntity
                        .ok("Event with ID " + id + " and all related records have been deleted successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Event with ID " + id + " not found.");
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(e.getMessage());
        }
    }
}
