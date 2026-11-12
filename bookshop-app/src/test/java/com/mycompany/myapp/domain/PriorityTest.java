package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.PriorityTestSamples.*;
import static com.mycompany.myapp.domain.ToDoItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PriorityTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Priority.class);
        Priority priority1 = getPrioritySample1();
        Priority priority2 = new Priority();
        assertThat(priority1).isNotEqualTo(priority2);

        priority2.setId(priority1.getId());
        assertThat(priority1).isEqualTo(priority2);

        priority2 = getPrioritySample2();
        assertThat(priority1).isNotEqualTo(priority2);
    }

    @Test
    void todoitemTest() {
        Priority priority = getPriorityRandomSampleGenerator();
        ToDoItem toDoItemBack = getToDoItemRandomSampleGenerator();

        priority.addTodoitem(toDoItemBack);
        assertThat(priority.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getPriority()).isEqualTo(priority);

        priority.removeTodoitem(toDoItemBack);
        assertThat(priority.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getPriority()).isNull();

        priority.todoitems(new HashSet<>(Set.of(toDoItemBack)));
        assertThat(priority.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getPriority()).isEqualTo(priority);

        priority.setTodoitems(new HashSet<>());
        assertThat(priority.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getPriority()).isNull();
    }
}
