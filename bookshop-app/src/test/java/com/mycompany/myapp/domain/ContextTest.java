package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ContextTestSamples.*;
import static com.mycompany.myapp.domain.ToDoItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ContextTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Context.class);
        Context context1 = getContextSample1();
        Context context2 = new Context();
        assertThat(context1).isNotEqualTo(context2);

        context2.setId(context1.getId());
        assertThat(context1).isEqualTo(context2);

        context2 = getContextSample2();
        assertThat(context1).isNotEqualTo(context2);
    }

    @Test
    void todoitemTest() {
        Context context = getContextRandomSampleGenerator();
        ToDoItem toDoItemBack = getToDoItemRandomSampleGenerator();

        context.addTodoitem(toDoItemBack);
        assertThat(context.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getContext()).isEqualTo(context);

        context.removeTodoitem(toDoItemBack);
        assertThat(context.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getContext()).isNull();

        context.todoitems(new HashSet<>(Set.of(toDoItemBack)));
        assertThat(context.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getContext()).isEqualTo(context);

        context.setTodoitems(new HashSet<>());
        assertThat(context.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getContext()).isNull();
    }
}
