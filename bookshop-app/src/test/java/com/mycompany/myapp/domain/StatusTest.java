package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.StatusTestSamples.*;
import static com.mycompany.myapp.domain.ToDoItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class StatusTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Status.class);
        Status status1 = getStatusSample1();
        Status status2 = new Status();
        assertThat(status1).isNotEqualTo(status2);

        status2.setId(status1.getId());
        assertThat(status1).isEqualTo(status2);

        status2 = getStatusSample2();
        assertThat(status1).isNotEqualTo(status2);
    }

    @Test
    void todoitemTest() {
        Status status = getStatusRandomSampleGenerator();
        ToDoItem toDoItemBack = getToDoItemRandomSampleGenerator();

        status.addTodoitem(toDoItemBack);
        assertThat(status.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getStatus()).isEqualTo(status);

        status.removeTodoitem(toDoItemBack);
        assertThat(status.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getStatus()).isNull();

        status.todoitems(new HashSet<>(Set.of(toDoItemBack)));
        assertThat(status.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getStatus()).isEqualTo(status);

        status.setTodoitems(new HashSet<>());
        assertThat(status.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getStatus()).isNull();
    }
}
