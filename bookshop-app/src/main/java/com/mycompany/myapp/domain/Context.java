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
 * A Context.
 */
@Entity
@Table(name = "context")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Context implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "descrription")
    private String descrription;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "context")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "owner", "project", "context", "priority", "status" }, allowSetters = true)
    private Set<ToDoItem> todoitems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Context id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescrription() {
        return this.descrription;
    }

    public Context descrription(String descrription) {
        this.setDescrription(descrription);
        return this;
    }

    public void setDescrription(String descrription) {
        this.descrription = descrription;
    }

    public Set<ToDoItem> getTodoitems() {
        return this.todoitems;
    }

    public void setTodoitems(Set<ToDoItem> toDoItems) {
        if (this.todoitems != null) {
            this.todoitems.forEach(i -> i.setContext(null));
        }
        if (toDoItems != null) {
            toDoItems.forEach(i -> i.setContext(this));
        }
        this.todoitems = toDoItems;
    }

    public Context todoitems(Set<ToDoItem> toDoItems) {
        this.setTodoitems(toDoItems);
        return this;
    }

    public Context addTodoitem(ToDoItem toDoItem) {
        this.todoitems.add(toDoItem);
        toDoItem.setContext(this);
        return this;
    }

    public Context removeTodoitem(ToDoItem toDoItem) {
        this.todoitems.remove(toDoItem);
        toDoItem.setContext(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Context)) {
            return false;
        }
        return getId() != null && getId().equals(((Context) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Context{" +
            "id=" + getId() +
            ", descrription='" + getDescrription() + "'" +
            "}";
    }
}
