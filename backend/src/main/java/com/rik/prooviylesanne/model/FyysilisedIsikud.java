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
@Table(name = "fyysilised_isikud")
@Getter
@Setter
@NoArgsConstructor
public class FyysilisedIsikud {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, name = "eesnimi")
    private String eesnimi;

    @Column(nullable = false, name = "perekonnanimi")
    private String perekonnanimi;

    @Column(nullable = false, name = "isikukood", length = 11)
    private String isikukood;

    @ManyToOne
    @JoinColumn(name = "maksmise_viis", referencedColumnName = "maksmise_viis", nullable = false)
    private MaksmiseViisid maksmiseViis;

    @Column(nullable = false, name = "lisainfo", length = 1500)
    private String lisainfo;
}
