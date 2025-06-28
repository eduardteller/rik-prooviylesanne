package com.rik.prooviylesanne.service;

import com.rik.prooviylesanne.model.FyysilisedIsikud;
import com.rik.prooviylesanne.model.JuriidilisedIsikud;
import com.rik.prooviylesanne.model.MaksmiseViisid;
import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.model.YritusedIsikud;
import com.rik.prooviylesanne.repository.FyysilisedIsikudRepository;
import com.rik.prooviylesanne.repository.JuriidilisedIsikudRepository;
import com.rik.prooviylesanne.repository.MaksmiseViisidRepository;
import com.rik.prooviylesanne.repository.YritusedIsikudRepository;
import com.rik.prooviylesanne.repository.YritusedRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class IsikudService {

    private final FyysilisedIsikudRepository fyysilisedIsikudRepository;
    private final JuriidilisedIsikudRepository juriidilisedIsikudRepository;
    private final YritusedRepository yritusedRepository;
    private final YritusedIsikudRepository yritusedIsikudRepository;
    private final MaksmiseViisidRepository maksmiseViisidRepository;

    @Autowired
    public IsikudService(
            FyysilisedIsikudRepository fyysilisedIsikudRepository,
            JuriidilisedIsikudRepository juriidilisedIsikudRepository,
            YritusedRepository yritusedRepository,
            YritusedIsikudRepository yritusedIsikudRepository,
            MaksmiseViisidRepository maksmiseViisidRepository) {
        this.fyysilisedIsikudRepository = fyysilisedIsikudRepository;
        this.juriidilisedIsikudRepository = juriidilisedIsikudRepository;
        this.yritusedRepository = yritusedRepository;
        this.yritusedIsikudRepository = yritusedIsikudRepository;
        this.maksmiseViisidRepository = maksmiseViisidRepository;
    }

    @Transactional
    public FyysilisedIsikud addFyysilineIsikToYritus(FyysilisedIsikud isik, Long yritusId, String maksmiseViisString) {
        Optional<Yritused> yritusOpt = yritusedRepository.findById(yritusId);
        if (!yritusOpt.isPresent()) {
            throw new RuntimeException("Yritus with ID " + yritusId + " not found");
        }

        MaksmiseViisid maksmiseViis = maksmiseViisidRepository.findByMaksmiseViis(maksmiseViisString)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found: " + maksmiseViisString));

        isik.setMaksmiseViis(maksmiseViis);

        FyysilisedIsikud savedIsik = fyysilisedIsikudRepository.save(isik);

        YritusedIsikud yritusedIsik = new YritusedIsikud();
        yritusedIsik.setYritus(yritusOpt.get());
        yritusedIsik.setFyysilineIsikId(savedIsik);
        yritusedIsikudRepository.save(yritusedIsik);

        return savedIsik;
    }

    @Transactional
    public JuriidilisedIsikud addJuriidilineIsikToYritus(JuriidilisedIsikud isik, Long yritusId, String maksmiseViisString) {
        Optional<Yritused> yritusOpt = yritusedRepository.findById(yritusId);
        if (!yritusOpt.isPresent()) {
            throw new RuntimeException("Yritus with ID " + yritusId + " not found");
        }

        MaksmiseViisid maksmiseViis = maksmiseViisidRepository.findByMaksmiseViis(maksmiseViisString)
                .orElseThrow(() -> new IllegalArgumentException("Payment method not found: " + maksmiseViisString));

        isik.setMaksmiseViis(maksmiseViis);

        JuriidilisedIsikud savedIsik = juriidilisedIsikudRepository.save(isik);

        YritusedIsikud yritusedIsik = new YritusedIsikud();
        yritusedIsik.setYritus(yritusOpt.get());
        yritusedIsik.setJuriidilineIsikId(savedIsik);
        yritusedIsikudRepository.save(yritusedIsik);

        return savedIsik;
    }

    @Transactional
    public boolean deleteFyysilineIsik(Long id) {
        Optional<FyysilisedIsikud> isikOpt = fyysilisedIsikudRepository.findById(id);

        if (isikOpt.isPresent()) {
            FyysilisedIsikud isik = isikOpt.get();

            yritusedIsikudRepository.deleteByFyysilineIsikId(isik);

            fyysilisedIsikudRepository.delete(isik);
            return true;
        }

        return false;
    }

    @Transactional
    public boolean deleteJuriidilineIsik(Long id) {
        Optional<JuriidilisedIsikud> isikOpt = juriidilisedIsikudRepository.findById(id);

        if (isikOpt.isPresent()) {
            JuriidilisedIsikud isik = isikOpt.get();

            yritusedIsikudRepository.deleteByJuriidilineIsikId(isik);

            juriidilisedIsikudRepository.delete(isik);
            return true;
        }

        return false;
    }

    public Map<String, Object> getAllIsikudForYritus(Long yritusId) {
        Optional<Yritused> yritusOpt = yritusedRepository.findById(yritusId);
        if (!yritusOpt.isPresent()) {
            throw new RuntimeException("Event with ID " + yritusId + " not found");
        }

        Yritused yritus = yritusOpt.get();
        List<YritusedIsikud> yritusedIsikud = yritusedIsikudRepository.findByYritus(yritus);

        List<FyysilisedIsikud> fyysilisedIsikud = new ArrayList<>();
        List<JuriidilisedIsikud> juriidilisedIsikud = new ArrayList<>();

        for (YritusedIsikud yritusIsik : yritusedIsikud) {
            if (yritusIsik.getFyysilineIsikId() != null) {
                fyysilisedIsikud.add(yritusIsik.getFyysilineIsikId());
            } else if (yritusIsik.getJuriidilineIsikId() != null) {
                juriidilisedIsikud.add(yritusIsik.getJuriidilineIsikId());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("fyysilisedIsikud", fyysilisedIsikud);
        result.put("juriidilisedIsikud", juriidilisedIsikud);

        return result;
    }

    @Transactional
    public FyysilisedIsikud updateFyysilineIsik(Long id, FyysilisedIsikud updatedIsik, String maksmiseViisString) {
        Optional<FyysilisedIsikud> isikOpt = fyysilisedIsikudRepository.findById(id);
        if (!isikOpt.isPresent()) {
            throw new RuntimeException("Physical person with ID " + id + " not found");
        }

        FyysilisedIsikud existingIsik = isikOpt.get();

        existingIsik.setEesnimi(updatedIsik.getEesnimi());
        existingIsik.setPerekonnanimi(updatedIsik.getPerekonnanimi());
        existingIsik.setIsikukood(updatedIsik.getIsikukood());
        existingIsik.setLisainfo(updatedIsik.getLisainfo());

        if (maksmiseViisString != null && !maksmiseViisString.isEmpty()) {
            MaksmiseViisid maksmiseViis = maksmiseViisidRepository.findByMaksmiseViis(maksmiseViisString)
                    .orElseThrow(() -> new IllegalArgumentException("Payment method not found: " + maksmiseViisString));
            existingIsik.setMaksmiseViis(maksmiseViis);
        }

        return fyysilisedIsikudRepository.save(existingIsik);
    }

    @Transactional
    public JuriidilisedIsikud updateJuriidilineIsik(Long id, JuriidilisedIsikud updatedIsik, String maksmiseViisString) {
        Optional<JuriidilisedIsikud> isikOpt = juriidilisedIsikudRepository.findById(id);
        if (!isikOpt.isPresent()) {
            throw new RuntimeException("Legal entity with ID " + id + " not found");
        }

        JuriidilisedIsikud existingIsik = isikOpt.get();

        existingIsik.setNimi(updatedIsik.getNimi());
        existingIsik.setRegistrikood(updatedIsik.getRegistrikood());
        existingIsik.setOsavotjateArv(updatedIsik.getOsavotjateArv());
        existingIsik.setLisainfo(updatedIsik.getLisainfo());

        if (maksmiseViisString != null && !maksmiseViisString.isEmpty()) {
            MaksmiseViisid maksmiseViis = maksmiseViisidRepository.findByMaksmiseViis(maksmiseViisString)
                    .orElseThrow(() -> new IllegalArgumentException("Payment method not found: " + maksmiseViisString));
            existingIsik.setMaksmiseViis(maksmiseViis);
        }

        return juriidilisedIsikudRepository.save(existingIsik);
    }

    public FyysilisedIsikud getFyysilineIsikById(Long id) {
        return fyysilisedIsikudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Physical person with ID " + id + " not found"));
    }

    public JuriidilisedIsikud getJuriidilineIsikById(Long id) {
        return juriidilisedIsikudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Legal entity with ID " + id + " not found"));
    }
}
