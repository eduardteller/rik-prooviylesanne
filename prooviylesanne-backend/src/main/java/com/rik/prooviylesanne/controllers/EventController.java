package com.rik.prooviylesanne.controllers;

import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class EventController {

    @Setter
    @Getter
    public static class EventReq {
        private String name;

    }

    @PostMapping("/print-name")
    public ResponseEntity<Void> printName(@RequestBody EventReq request) {
        System.out.println(request.getName());
        return ResponseEntity.ok().build();
    }
}

