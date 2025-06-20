package com.rik.prooviylesanne.repository;

import com.rik.prooviylesanne.model.JuriidilisedIsikud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JuriidilisedIsikudRepository extends JpaRepository<JuriidilisedIsikud, Long> {
}
