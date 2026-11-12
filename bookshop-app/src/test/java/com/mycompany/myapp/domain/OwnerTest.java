package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.OwnerTestSamples.*;
import static com.mycompany.myapp.domain.ToDoItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class OwnerTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Owner.class);
        Owner owner1 = getOwnerSample1();
        Owner owner2 = new Owner();
        assertThat(owner1).isNotEqualTo(owner2);

        owner2.setId(owner1.getId());
        assertThat(owner1).isEqualTo(owner2);

        owner2 = getOwnerSample2();
        assertThat(owner1).isNotEqualTo(owner2);
    }

    @Test
    void todoitemTest() {
        Owner owner = getOwnerRandomSampleGenerator();
        ToDoItem toDoItemBack = getToDoItemRandomSampleGenerator();

        owner.addTodoitem(toDoItemBack);
        assertThat(owner.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getOwner()).isEqualTo(owner);

        owner.removeTodoitem(toDoItemBack);
        assertThat(owner.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getOwner()).isNull();

        owner.todoitems(new HashSet<>(Set.of(toDoItemBack)));
        assertThat(owner.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getOwner()).isEqualTo(owner);

        owner.setTodoitems(new HashSet<>());
        assertThat(owner.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getOwner()).isNull();
    }
}
