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
 * A Owner.
 */
@Entity
@Table(name = "owner")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Owner implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private String id;

    @NotNull
    @Column(name = "firstname", nullable = false)
    private String firstname;

    @NotNull
    @Column(name = "surname", nullable = false)
    private String surname;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "owner")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "owner", "project", "context", "priority", "status" }, allowSetters = true)
    private Set<ToDoItem> todoitems = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Owner id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstname() {
        return this.firstname;
    }

    public Owner firstname(String firstname) {
        this.setFirstname(firstname);
        return this;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getSurname() {
        return this.surname;
    }

    public Owner surname(String surname) {
        this.setSurname(surname);
        return this;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public Set<ToDoItem> getTodoitems() {
        return this.todoitems;
    }

    public void setTodoitems(Set<ToDoItem> toDoItems) {
        if (this.todoitems != null) {
            this.todoitems.forEach(i -> i.setOwner(null));
        }
        if (toDoItems != null) {
            toDoItems.forEach(i -> i.setOwner(this));
        }
        this.todoitems = toDoItems;
    }

    public Owner todoitems(Set<ToDoItem> toDoItems) {
        this.setTodoitems(toDoItems);
        return this;
    }

    public Owner addTodoitem(ToDoItem toDoItem) {
        this.todoitems.add(toDoItem);
        toDoItem.setOwner(this);
        return this;
    }

    public Owner removeTodoitem(ToDoItem toDoItem) {
        this.todoitems.remove(toDoItem);
        toDoItem.setOwner(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Owner)) {
            return false;
        }
        return getId() != null && getId().equals(((Owner) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Owner{" +
            "id=" + getId() +
            ", firstname='" + getFirstname() + "'" +
            ", surname='" + getSurname() + "'" +
            "}";
    }
}
