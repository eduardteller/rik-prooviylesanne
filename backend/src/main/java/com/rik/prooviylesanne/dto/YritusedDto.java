package com.rik.prooviylesanne.dto;

import java.time.OffsetDateTime;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class YritusedDto {
    private Long id;
    private String nimi;
    private OffsetDateTime aeg;
    private String koht;
    private String lisainfo;
    private Integer isikudCount;

    public YritusedDto(Long id, String nimi, OffsetDateTime aeg, String koht, String lisainfo, Integer isikudCount) {
        this.id = id;
        this.nimi = nimi;
        this.aeg = aeg;
        this.koht = koht;
        this.lisainfo = lisainfo;
        this.isikudCount = isikudCount;
    }
}
