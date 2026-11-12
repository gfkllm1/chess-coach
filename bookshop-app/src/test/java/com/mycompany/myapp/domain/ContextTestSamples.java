package com.mycompany.myapp.domain;

import java.util.UUID;

public class ContextTestSamples {

    public static Context getContextSample1() {
        return new Context().id("id1").descrription("descrription1");
    }

    public static Context getContextSample2() {
        return new Context().id("id2").descrription("descrription2");
    }

    public static Context getContextRandomSampleGenerator() {
        return new Context().id(UUID.randomUUID().toString()).descrription(UUID.randomUUID().toString());
    }
}
