package com.rik.prooviylesanne.service;

import com.rik.prooviylesanne.model.FyysilisedIsikud;
import com.rik.prooviylesanne.model.JuriidilisedIsikud;
import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.model.YritusedIsikud;
import com.rik.prooviylesanne.repository.FyysilisedIsikudRepository;
import com.rik.prooviylesanne.repository.JuriidilisedIsikudRepository;
import com.rik.prooviylesanne.repository.YritusedIsikudRepository;
import com.rik.prooviylesanne.repository.YritusedRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class IsikudService {

    private final FyysilisedIsikudRepository fyysilisedIsikudRepository;
    private final JuriidilisedIsikudRepository juriidilisedIsikudRepository;
    private final YritusedRepository yritusedRepository;
    private final YritusedIsikudRepository yritusedIsikudRepository;

    @Autowired
    public IsikudService(
            FyysilisedIsikudRepository fyysilisedIsikudRepository,
            JuriidilisedIsikudRepository juriidilisedIsikudRepository,
            YritusedRepository yritusedRepository,
            YritusedIsikudRepository yritusedIsikudRepository) {
        this.fyysilisedIsikudRepository = fyysilisedIsikudRepository;
        this.juriidilisedIsikudRepository = juriidilisedIsikudRepository;
        this.yritusedRepository = yritusedRepository;
        this.yritusedIsikudRepository = yritusedIsikudRepository;
    }

    @Transactional
    public FyysilisedIsikud addFyysilineIsikToYritus(FyysilisedIsikud isik, Long yritusId) {
        Optional<Yritused> yritusOpt = yritusedRepository.findById(yritusId);
        if (!yritusOpt.isPresent()) {
            throw new RuntimeException("Yritus with ID " + yritusId + " not found");
        }

        FyysilisedIsikud savedIsik = fyysilisedIsikudRepository.save(isik);

        YritusedIsikud yritusedIsik = new YritusedIsikud();
        yritusedIsik.setYritus(yritusOpt.get());
        yritusedIsik.setFyysilineIsikId(savedIsik);
        yritusedIsikudRepository.save(yritusedIsik);

        return savedIsik;
    }

    @Transactional
    public JuriidilisedIsikud addJuriidilineIsikToYritus(JuriidilisedIsikud isik, Long yritusId) {
        Optional<Yritused> yritusOpt = yritusedRepository.findById(yritusId);
        if (!yritusOpt.isPresent()) {
            throw new RuntimeException("Yritus with ID " + yritusId + " not found");
        }

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
}
