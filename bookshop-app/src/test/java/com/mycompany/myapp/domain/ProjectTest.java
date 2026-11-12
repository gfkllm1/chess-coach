package com.mycompany.myapp.domain;

import static com.mycompany.myapp.domain.ProjectTestSamples.*;
import static com.mycompany.myapp.domain.ToDoItemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class ProjectTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Project.class);
        Project project1 = getProjectSample1();
        Project project2 = new Project();
        assertThat(project1).isNotEqualTo(project2);

        project2.setId(project1.getId());
        assertThat(project1).isEqualTo(project2);

        project2 = getProjectSample2();
        assertThat(project1).isNotEqualTo(project2);
    }

    @Test
    void todoitemTest() {
        Project project = getProjectRandomSampleGenerator();
        ToDoItem toDoItemBack = getToDoItemRandomSampleGenerator();

        project.addTodoitem(toDoItemBack);
        assertThat(project.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getProject()).isEqualTo(project);

        project.removeTodoitem(toDoItemBack);
        assertThat(project.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getProject()).isNull();

        project.todoitems(new HashSet<>(Set.of(toDoItemBack)));
        assertThat(project.getTodoitems()).containsOnly(toDoItemBack);
        assertThat(toDoItemBack.getProject()).isEqualTo(project);

        project.setTodoitems(new HashSet<>());
        assertThat(project.getTodoitems()).doesNotContain(toDoItemBack);
        assertThat(toDoItemBack.getProject()).isNull();
    }
}
