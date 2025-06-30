package com.rik.prooviylesanne.repository;

import com.rik.prooviylesanne.model.JuriidilisedIsikud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JuriidilisedIsikudRepository extends JpaRepository<JuriidilisedIsikud, Long> {
    boolean existsByRegistrikood( String registrikood);
}
