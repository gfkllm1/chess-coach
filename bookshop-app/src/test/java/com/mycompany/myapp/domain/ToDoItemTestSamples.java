package com.mycompany.myapp.domain;

import java.util.UUID;

public class ToDoItemTestSamples {

    public static ToDoItem getToDoItemSample1() {
        return new ToDoItem().id("id1").description("description1");
    }

    public static ToDoItem getToDoItemSample2() {
        return new ToDoItem().id("id2").description("description2");
    }

    public static ToDoItem getToDoItemRandomSampleGenerator() {
        return new ToDoItem().id(UUID.randomUUID().toString()).description(UUID.randomUUID().toString());
    }
}
