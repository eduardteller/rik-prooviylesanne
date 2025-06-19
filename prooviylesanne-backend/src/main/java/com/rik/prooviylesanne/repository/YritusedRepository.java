package com.rik.prooviylesanne.repository;

import com.rik.prooviylesanne.model.Yritused;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface YritusedRepository extends JpaRepository<Yritused, Long> {
}
