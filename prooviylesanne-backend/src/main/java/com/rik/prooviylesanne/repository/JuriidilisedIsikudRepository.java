package com.rik.prooviylesanne.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rik.prooviylesanne.model.JuriidilisedIsikud;

@Repository
public interface JuriidilisedIsikudRepository extends JpaRepository<JuriidilisedIsikud, Long> {
    boolean existsByRegistrikood(String registrikood);
}
