package com.rik.prooviylesanne.service;

import com.rik.prooviylesanne.dto.YritusedDto;
import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.model.YritusedIsikud;
import com.rik.prooviylesanne.repository.YritusedIsikudRepository;
import com.rik.prooviylesanne.repository.YritusedRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
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
        if (isEventInPast(yritus.getAeg())) {
            throw new IllegalArgumentException("Cannot add an event with a date in the past");
        }
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

            int fyysilisedCount = 0;
            int juriidilisedOsavotjateCount = 0;

            for (YritusedIsikud isik : isikud) {
                if (isik.getFyysilineIsikId() != null) {
                    fyysilisedCount++;
                } else if (isik.getJuriidilineIsikId() != null) {
                    String osavotjateArvStr = isik.getJuriidilineIsikId().getOsavotjateArv();
                    try {
                        int osavotjateArv = Integer.parseInt(osavotjateArvStr);
                        juriidilisedOsavotjateCount += osavotjateArv;
                    } catch (NumberFormatException e) {
                        // tyhi
                    }
                }
            }

            Integer totalParticipants = fyysilisedCount + juriidilisedOsavotjateCount;

            YritusedDto dto = new YritusedDto(
                    yritus.getId(),
                    yritus.getNimi(),
                    yritus.getAeg(),
                    yritus.getKoht(),
                    yritus.getLisainfo(),
                    totalParticipants
            );

            yritusedDtos.add(dto);
        }

        return yritusedDtos;
    }

    public Optional<YritusedDto> getYritusDtoById(Long id) {
        Optional<Yritused> yritusOpt = yritusedRepository.findById(id);

        if (yritusOpt.isPresent()) {
            Yritused yritus = yritusOpt.get();
            List<YritusedIsikud> isikud = yritusedIsikudRepository.findByYritus(yritus);

            int fyysilisedCount = 0;
            int juriidilisedOsavotjateCount = 0;

            for (YritusedIsikud isik : isikud) {
                if (isik.getFyysilineIsikId() != null) {
                    fyysilisedCount++;
                } else if (isik.getJuriidilineIsikId() != null) {
                    String osavotjateArvStr = isik.getJuriidilineIsikId().getOsavotjateArv();
                    try {
                        int osavotjateArv = Integer.parseInt(osavotjateArvStr);
                        juriidilisedOsavotjateCount += osavotjateArv;
                    } catch (NumberFormatException e) {
                        // tyhi
                    }
                }
            }

            Integer totalParticipants = fyysilisedCount + juriidilisedOsavotjateCount;

            YritusedDto dto = new YritusedDto(
                    yritus.getId(),
                    yritus.getNimi(),
                    yritus.getAeg(),
                    yritus.getKoht(),
                    yritus.getLisainfo(),
                    totalParticipants
            );

            return Optional.of(dto);
        }

        return Optional.empty();
    }

    @Transactional
    public boolean deleteYritusWithRelatedRecords(Long id) {
        Optional<Yritused> yritusOpt = yritusedRepository.findById(id);

        if (yritusOpt.isPresent()) {
            Yritused yritus = yritusOpt.get();
            if (isEventInPast(yritus.getAeg())) {
                throw new IllegalArgumentException("Cannot delete an event that has already passed");
            }
            yritusedIsikudRepository.deleteByYritus(yritus);
            yritusedRepository.delete(yritus);
            return true;
        }

        return false;
    }

    /**
     * Checks if the event time is in the past
     *
     * @param eventTime The time of the event
     * @return true if the event time is before the current time
     */
    private boolean isEventInPast(OffsetDateTime eventTime) {
        return eventTime != null && eventTime.isBefore(OffsetDateTime.now());
    }
}
