package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Status.
 */
@Entity
@Table(name = "status")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Status implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "type")
    private String type;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "status")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "owner", "project", "context", "priority", "status" }, allowSetters = true)
    private Set<ToDoItem> todoitems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Status id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return this.type;
    }

    public Status type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Set<ToDoItem> getTodoitems() {
        return this.todoitems;
    }

    public void setTodoitems(Set<ToDoItem> toDoItems) {
        if (this.todoitems != null) {
            this.todoitems.forEach(i -> i.setStatus(null));
        }
        if (toDoItems != null) {
            toDoItems.forEach(i -> i.setStatus(this));
        }
        this.todoitems = toDoItems;
    }

    public Status todoitems(Set<ToDoItem> toDoItems) {
        this.setTodoitems(toDoItems);
        return this;
    }

    public Status addTodoitem(ToDoItem toDoItem) {
        this.todoitems.add(toDoItem);
        toDoItem.setStatus(this);
        return this;
    }

    public Status removeTodoitem(ToDoItem toDoItem) {
        this.todoitems.remove(toDoItem);
        toDoItem.setStatus(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Status)) {
            return false;
        }
        return getId() != null && getId().equals(((Status) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Status{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            "}";
    }
}
