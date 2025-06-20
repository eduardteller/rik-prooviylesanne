package com.rik.prooviylesanne.repository;

import com.rik.prooviylesanne.model.Yritused;
import com.rik.prooviylesanne.model.YritusedIsikud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface YritusedIsikudRepository extends JpaRepository<YritusedIsikud, Long> {
    List<YritusedIsikud> findByYritus(Yritused yritus);
    void deleteByYritus(Yritused yritus);
}
