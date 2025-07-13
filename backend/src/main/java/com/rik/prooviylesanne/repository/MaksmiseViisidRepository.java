package com.rik.prooviylesanne.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rik.prooviylesanne.model.MaksmiseViisid;

@Repository
public interface MaksmiseViisidRepository extends JpaRepository<MaksmiseViisid, Long> {
    Optional<MaksmiseViisid> findByMaksmiseViis(String maksmiseViis);
}
