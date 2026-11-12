package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ContextTestSamples.*;
import static com.mycompany.myapp.domain.OwnerTestSamples.*;
import static com.mycompany.myapp.domain.PriorityTestSamples.*;
import static com.mycompany.myapp.domain.ProjectTestSamples.*;
import static com.mycompany.myapp.domain.StatusTestSamples.*;
import static com.mycompany.myapp.domain.ToDoItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ToDoItemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(ToDoItem.class);
        ToDoItem toDoItem1 = getToDoItemSample1();
        ToDoItem toDoItem2 = new ToDoItem();
        assertThat(toDoItem1).isNotEqualTo(toDoItem2);

        toDoItem2.setId(toDoItem1.getId());
        assertThat(toDoItem1).isEqualTo(toDoItem2);

        toDoItem2 = getToDoItemSample2();
        assertThat(toDoItem1).isNotEqualTo(toDoItem2);
    }

    @Test
    void ownerTest() {
        ToDoItem toDoItem = getToDoItemRandomSampleGenerator();
        Owner ownerBack = getOwnerRandomSampleGenerator();

        toDoItem.setOwner(ownerBack);
        assertThat(toDoItem.getOwner()).isEqualTo(ownerBack);

        toDoItem.owner(null);
        assertThat(toDoItem.getOwner()).isNull();
    }

    @Test
    void projectTest() {
        ToDoItem toDoItem = getToDoItemRandomSampleGenerator();
        Project projectBack = getProjectRandomSampleGenerator();

        toDoItem.setProject(projectBack);
        assertThat(toDoItem.getProject()).isEqualTo(projectBack);

        toDoItem.project(null);
        assertThat(toDoItem.getProject()).isNull();
    }

    @Test
    void contextTest() {
        ToDoItem toDoItem = getToDoItemRandomSampleGenerator();
        Context contextBack = getContextRandomSampleGenerator();

        toDoItem.setContext(contextBack);
        assertThat(toDoItem.getContext()).isEqualTo(contextBack);

        toDoItem.context(null);
        assertThat(toDoItem.getContext()).isNull();
    }

    @Test
    void priorityTest() {
        ToDoItem toDoItem = getToDoItemRandomSampleGenerator();
        Priority priorityBack = getPriorityRandomSampleGenerator();

        toDoItem.setPriority(priorityBack);
        assertThat(toDoItem.getPriority()).isEqualTo(priorityBack);

        toDoItem.priority(null);
        assertThat(toDoItem.getPriority()).isNull();
    }

    @Test
    void statusTest() {
        ToDoItem toDoItem = getToDoItemRandomSampleGenerator();
        Status statusBack = getStatusRandomSampleGenerator();

        toDoItem.setStatus(statusBack);
        assertThat(toDoItem.getStatus()).isEqualTo(statusBack);

        toDoItem.status(null);
        assertThat(toDoItem.getStatus()).isNull();
    }
}
