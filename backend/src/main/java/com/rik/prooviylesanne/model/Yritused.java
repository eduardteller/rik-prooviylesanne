package com.rik.prooviylesanne.model;

import java.time.OffsetDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
