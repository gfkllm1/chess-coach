package com.mycompany.myapp.domain;

import java.util.UUID;

public class OwnerTestSamples {

    public static Owner getOwnerSample1() {
        return new Owner().id("id1").firstname("firstname1").surname("surname1");
    }

    public static Owner getOwnerSample2() {
        return new Owner().id("id2").firstname("firstname2").surname("surname2");
    }

    public static Owner getOwnerRandomSampleGenerator() {
        return new Owner().id(UUID.randomUUID().toString()).firstname(UUID.randomUUID().toString()).surname(UUID.randomUUID().toString());
    }
}
