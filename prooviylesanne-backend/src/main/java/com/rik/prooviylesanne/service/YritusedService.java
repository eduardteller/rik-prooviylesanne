package com.rik.prooviylesanne.service;

import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.repository.YritusedRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class YritusedService {

    private final YritusedRepository yritusedRepository;

    @Autowired
    public YritusedService(YritusedRepository yritusedRepository) {
        this.yritusedRepository = yritusedRepository;
    }

    public Yritused saveYritus(Yritused yritus) {
        return yritusedRepository.save(yritus);
    }
}
