package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A ToDoItem.
 */
@Entity
@Table(name = "to_do_item")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ToDoItem implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private String id;

    @Column(name = "description")
    private String description;

    @Column(name = "duedate")
    private LocalDate duedate;

    @Column(name = "completetiondate")
    private LocalDate completetiondate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "todoitems" }, allowSetters = true)
    private Owner owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "todoitems" }, allowSetters = true)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "todoitems" }, allowSetters = true)
    private Context context;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "todoitems" }, allowSetters = true)
    private Priority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "todoitems" }, allowSetters = true)
    private Status status;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public ToDoItem id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescription() {
        return this.description;
    }

    public ToDoItem description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDuedate() {
        return this.duedate;
    }

    public ToDoItem duedate(LocalDate duedate) {
        this.setDuedate(duedate);
        return this;
    }

    public void setDuedate(LocalDate duedate) {
        this.duedate = duedate;
    }

    public LocalDate getCompletetiondate() {
        return this.completetiondate;
    }

    public ToDoItem completetiondate(LocalDate completetiondate) {
        this.setCompletetiondate(completetiondate);
        return this;
    }

    public void setCompletetiondate(LocalDate completetiondate) {
        this.completetiondate = completetiondate;
    }

    public Owner getOwner() {
        return this.owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public ToDoItem owner(Owner owner) {
        this.setOwner(owner);
        return this;
    }

    public Project getProject() {
        return this.project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ToDoItem project(Project project) {
        this.setProject(project);
        return this;
    }

    public Context getContext() {
        return this.context;
    }

    public void setContext(Context context) {
        this.context = context;
    }

    public ToDoItem context(Context context) {
        this.setContext(context);
        return this;
    }

    public Priority getPriority() {
        return this.priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public ToDoItem priority(Priority priority) {
        this.setPriority(priority);
        return this;
    }

    public Status getStatus() {
        return this.status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public ToDoItem status(Status status) {
        this.setStatus(status);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ToDoItem)) {
            return false;
        }
        return getId() != null && getId().equals(((ToDoItem) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ToDoItem{" +
            "id=" + getId() +
            ", description='" + getDescription() + "'" +
            ", duedate='" + getDuedate() + "'" +
            ", completetiondate='" + getCompletetiondate() + "'" +
            "}";
    }
}
