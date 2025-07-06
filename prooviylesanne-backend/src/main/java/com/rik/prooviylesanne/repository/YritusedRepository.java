package com.rik.prooviylesanne.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rik.prooviylesanne.model.Yritused;

@Repository
public interface YritusedRepository extends JpaRepository<Yritused, Long> {
}
