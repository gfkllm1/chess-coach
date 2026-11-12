package com.mycompany.myapp.domain;

import java.util.UUID;

public class ProjectTestSamples {

    public static Project getProjectSample1() {
        return new Project().id("id1").projectname("projectname1");
    }

    public static Project getProjectSample2() {
        return new Project().id("id2").projectname("projectname2");
    }

    public static Project getProjectRandomSampleGenerator() {
        return new Project().id(UUID.randomUUID().toString()).projectname(UUID.randomUUID().toString());
    }
}
