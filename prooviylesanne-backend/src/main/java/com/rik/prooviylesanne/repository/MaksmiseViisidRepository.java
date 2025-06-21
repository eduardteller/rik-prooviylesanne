package com.rik.prooviylesanne.repository;

import com.rik.prooviylesanne.model.MaksmiseViisid;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaksmiseViisidRepository extends JpaRepository<MaksmiseViisid, Long> {
    Optional<MaksmiseViisid> findByMaksmiseViis(String maksmiseViis);
}
