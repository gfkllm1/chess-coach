package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Priority.
 */
@Entity
@Table(name = "priority")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Priority implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "level")
    private String level;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "priority")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "owner", "project", "context", "priority", "status" }, allowSetters = true)
    private Set<ToDoItem> todoitems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Priority id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getLevel() {
        return this.level;
    }

    public Priority level(String level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Set<ToDoItem> getTodoitems() {
        return this.todoitems;
    }

    public void setTodoitems(Set<ToDoItem> toDoItems) {
        if (this.todoitems != null) {
            this.todoitems.forEach(i -> i.setPriority(null));
        }
        if (toDoItems != null) {
            toDoItems.forEach(i -> i.setPriority(this));
        }
        this.todoitems = toDoItems;
    }

    public Priority todoitems(Set<ToDoItem> toDoItems) {
        this.setTodoitems(toDoItems);
        return this;
    }

    public Priority addTodoitem(ToDoItem toDoItem) {
        this.todoitems.add(toDoItem);
        toDoItem.setPriority(this);
        return this;
    }

    public Priority removeTodoitem(ToDoItem toDoItem) {
        this.todoitems.remove(toDoItem);
        toDoItem.setPriority(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Priority)) {
            return false;
        }
        return getId() != null && getId().equals(((Priority) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Priority{" +
            "id=" + getId() +
            ", level='" + getLevel() + "'" +
            "}";
    }
}
