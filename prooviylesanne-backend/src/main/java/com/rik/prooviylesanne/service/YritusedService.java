package com.rik.prooviylesanne.service;

import com.rik.prooviylesanne.dto.YritusedDto;
import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.model.YritusedIsikud;
import com.rik.prooviylesanne.repository.YritusedIsikudRepository;
import com.rik.prooviylesanne.repository.YritusedRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    public List<YritusedDto> getAllYritusedAsDto() {
        List<Yritused> yritused = yritusedRepository.findAll();
        List<YritusedDto> yritusedDtos = new ArrayList<>();

        for (Yritused yritus : yritused) {
            List<YritusedIsikud> isikud = yritusedIsikudRepository.findByYritus(yritus);
            Integer isikudCount = isikud.size();

            YritusedDto dto = new YritusedDto(
                    yritus.getId(),
                    yritus.getNimi(),
                    yritus.getAeg(),
                    yritus.getKoht(),
                    yritus.getLisainfo(),
                    isikudCount
            );

            yritusedDtos.add(dto);
        }

        return yritusedDtos;
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
