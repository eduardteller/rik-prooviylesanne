package com.rik.prooviylesanne.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rik.prooviylesanne.model.FyysilisedIsikud;

@Repository
public interface FyysilisedIsikudRepository extends JpaRepository<FyysilisedIsikud, Long> {
    boolean existsByIsikukood(String isikukood);
}
