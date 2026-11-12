package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Project.
 */
@Entity
@Table(name = "project")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Project implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private String id;

    @NotNull
    @Column(name = "projectname", nullable = false)
    private String projectname;

    @Column(name = "budget")
    private Float budget;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "project")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "owner", "project", "context", "priority", "status" }, allowSetters = true)
    private Set<ToDoItem> todoitems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Project id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProjectname() {
        return this.projectname;
    }

    public Project projectname(String projectname) {
        this.setProjectname(projectname);
        return this;
    }

    public void setProjectname(String projectname) {
        this.projectname = projectname;
    }

    public Float getBudget() {
        return this.budget;
    }

    public Project budget(Float budget) {
        this.setBudget(budget);
        return this;
    }

    public void setBudget(Float budget) {
        this.budget = budget;
    }

    public Set<ToDoItem> getTodoitems() {
        return this.todoitems;
    }

    public void setTodoitems(Set<ToDoItem> toDoItems) {
        if (this.todoitems != null) {
            this.todoitems.forEach(i -> i.setProject(null));
        }
        if (toDoItems != null) {
            toDoItems.forEach(i -> i.setProject(this));
        }
        this.todoitems = toDoItems;
    }

    public Project todoitems(Set<ToDoItem> toDoItems) {
        this.setTodoitems(toDoItems);
        return this;
    }

    public Project addTodoitem(ToDoItem toDoItem) {
        this.todoitems.add(toDoItem);
        toDoItem.setProject(this);
        return this;
    }

    public Project removeTodoitem(ToDoItem toDoItem) {
        this.todoitems.remove(toDoItem);
        toDoItem.setProject(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Project)) {
            return false;
        }
        return getId() != null && getId().equals(((Project) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Project{" +
            "id=" + getId() +
            ", projectname='" + getProjectname() + "'" +
            ", budget=" + getBudget() +
            "}";
    }
}
