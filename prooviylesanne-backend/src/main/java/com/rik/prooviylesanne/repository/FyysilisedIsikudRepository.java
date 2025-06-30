package com.rik.prooviylesanne.repository;

import com.rik.prooviylesanne.model.FyysilisedIsikud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FyysilisedIsikudRepository extends JpaRepository<FyysilisedIsikud, Long> {
    boolean existsByIsikukood(String isikukood);
}
