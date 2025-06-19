package com.rik.prooviylesanne.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "maksmise_viisid")
@Getter
@Setter
@NoArgsConstructor
public class MaksmiseViisid {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "maksmise_viis", nullable = false, unique = true)
    private String maksmiseViis;
}

