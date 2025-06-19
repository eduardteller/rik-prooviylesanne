package com.rik.prooviylesanne.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.OffsetDateTime;

@Entity
@Table(name = "yritused")
@Getter
@Setter
@NoArgsConstructor
public class Yritused {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nimi;

    @Column(nullable = false)
    private OffsetDateTime aeg;

    @Column(nullable = false)
    private String koht;

    @Column(name = "lisainfo", length = 1000)
    private String lisainfo;
}

