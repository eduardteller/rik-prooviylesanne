package com.rik.prooviylesanne.service;

import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.repository.YritusedIsikudRepository;
import com.rik.prooviylesanne.repository.YritusedRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class YritusedService {

    private final YritusedRepository yritusedRepository;
    private final YritusedIsikudRepository yritusedIsikudRepository;

    @Autowired
    public YritusedService(YritusedRepository yritusedRepository, YritusedIsikudRepository yritusedIsikudRepository) {
        this.yritusedRepository = yritusedRepository;
        this.yritusedIsikudRepository = yritusedIsikudRepository;
    }

    public Yritused saveYritus(Yritused yritus) {
        return yritusedRepository.save(yritus);
    }

    public Optional<Yritused> getYritusById(Long id) {
        return yritusedRepository.findById(id);
    }

    public List<Yritused> getAllYritused() {
        return yritusedRepository.findAll();
    }

    @Transactional
    public boolean deleteYritusWithRelatedRecords(Long id) {
        Optional<Yritused> yritusOpt = yritusedRepository.findById(id);

        if (yritusOpt.isPresent()) {
            Yritused yritus = yritusOpt.get();
            yritusedIsikudRepository.deleteByYritus(yritus);
            yritusedRepository.delete(yritus);
            return true;
        }

        return false;
    }
}
