package com.rik.prooviylesanne.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "yritused_isikud")
@Getter
@Setter
@NoArgsConstructor
public class YritusedIsikud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "yrituse_id", referencedColumnName = "id")
    private Yritused yritus;

    @ManyToOne(optional = true)
    @JoinColumn(name = "juriidiline_isik_id", referencedColumnName = "id")
    private JuriidilisedIsikud juriidilineIsikId;

    @ManyToOne(optional = true)
    @JoinColumn(name = "fyysiline_isik_id", referencedColumnName = "id")
    private FyysilisedIsikud fyysilineIsikId;
}
