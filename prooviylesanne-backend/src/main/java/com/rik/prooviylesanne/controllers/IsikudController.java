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

    @PostMapping("/add-fyysiline-isik")
    public ResponseEntity<?> addFyysilineIsik(@RequestBody FyysilineIsikRequest request) {
        try {
            FyysilisedIsikud isik = new FyysilisedIsikud();
            isik.setEesnimi(request.getEesnimi());
            isik.setPerekonnanimi(request.getPerekonnanimi());
            isik.setIsikukood(request.getIsikukood());

            MaksmiseViisid maksmiseViis = new MaksmiseViisid();
            maksmiseViis.setMaksmiseViis(request.getMaksmiseViis());
            isik.setMaksmiseViis(maksmiseViis);

            isik.setLisainfo(request.getLisainfo());

            FyysilisedIsikud savedIsik = isikudService.addFyysilineIsikToYritus(isik, request.getYritusId());
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

            MaksmiseViisid maksmiseViis = new MaksmiseViisid();
            maksmiseViis.setMaksmiseViis(request.getMaksmiseViis());
            isik.setMaksmiseViis(maksmiseViis);

            isik.setLisainfo(request.getLisainfo());

            JuriidilisedIsikud savedIsik = isikudService.addJuriidilineIsikToYritus(isik, request.getYritusId());
            return ResponseEntity.ok(savedIsik);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to add legal entity: " + e.getMessage());
        }
    }
}
