package com.rik.prooviylesanne.repository;

import com.rik.prooviylesanne.model.FyysilisedIsikud;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FyysilisedIsikudRepository extends JpaRepository<FyysilisedIsikud, Long> {
}
