package com.rik.prooviylesanne.controllers;

import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.service.YritusedService;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.OffsetDateTime;

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
}
