package com.rik.prooviylesanne.model;

import jakarta.persistence.Column;
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
@Table(name = "juriidilised_isikud")
@Getter
@Setter
@NoArgsConstructor
public class JuriidilisedIsikud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "nimi")
    private String nimi;

    @Column(nullable = false, name = "registrikood", length = 8)
    private String registrikood;

    @Column(nullable = false, name = "osavotjate_arv", length = 11)
    private String osavotjateArv;

    @ManyToOne
    @JoinColumn(name = "maksmise_viis", referencedColumnName = "maksmise_viis", nullable = false)
    private MaksmiseViisid maksmiseViis;

    @Column(nullable = false, name = "lisainfo", length = 5000)
    private String lisainfo;
}
