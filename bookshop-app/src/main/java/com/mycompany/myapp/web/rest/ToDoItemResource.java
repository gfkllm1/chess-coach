package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.ToDoItem;
import com.mycompany.myapp.repository.ToDoItemRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.ToDoItem}.
 */
@RestController
@RequestMapping("/api/to-do-items")
@Transactional
public class ToDoItemResource {

    private static final Logger LOG = LoggerFactory.getLogger(ToDoItemResource.class);

    private static final String ENTITY_NAME = "toDoItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ToDoItemRepository toDoItemRepository;

    public ToDoItemResource(ToDoItemRepository toDoItemRepository) {
        this.toDoItemRepository = toDoItemRepository;
    }

    /**
     * {@code POST  /to-do-items} : Create a new toDoItem.
     *
     * @param toDoItem the toDoItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new toDoItem, or with status {@code 400 (Bad Request)} if the toDoItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<ToDoItem> createToDoItem(@Valid @RequestBody ToDoItem toDoItem) throws URISyntaxException {
        LOG.debug("REST request to save ToDoItem : {}", toDoItem);
        if (toDoItem.getId() != null) {
            throw new BadRequestAlertException("A new toDoItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        toDoItem = toDoItemRepository.save(toDoItem);
        return ResponseEntity.created(new URI("/api/to-do-items/" + toDoItem.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, toDoItem.getId()))
            .body(toDoItem);
    }

    /**
     * {@code PUT  /to-do-items/:id} : Updates an existing toDoItem.
     *
     * @param id the id of the toDoItem to save.
     * @param toDoItem the toDoItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated toDoItem,
     * or with status {@code 400 (Bad Request)} if the toDoItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the toDoItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ToDoItem> updateToDoItem(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody ToDoItem toDoItem
    ) throws URISyntaxException {
        LOG.debug("REST request to update ToDoItem : {}, {}", id, toDoItem);
        if (toDoItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, toDoItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!toDoItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        toDoItem = toDoItemRepository.save(toDoItem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, toDoItem.getId()))
            .body(toDoItem);
    }

    /**
     * {@code PATCH  /to-do-items/:id} : Partial updates given fields of an existing toDoItem, field will ignore if it is null
     *
     * @param id the id of the toDoItem to save.
     * @param toDoItem the toDoItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated toDoItem,
     * or with status {@code 400 (Bad Request)} if the toDoItem is not valid,
     * or with status {@code 404 (Not Found)} if the toDoItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the toDoItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<ToDoItem> partialUpdateToDoItem(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody ToDoItem toDoItem
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update ToDoItem partially : {}, {}", id, toDoItem);
        if (toDoItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, toDoItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!toDoItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<ToDoItem> result = toDoItemRepository
            .findById(toDoItem.getId())
            .map(existingToDoItem -> {
                if (toDoItem.getDescription() != null) {
                    existingToDoItem.setDescription(toDoItem.getDescription());
                }
                if (toDoItem.getDuedate() != null) {
                    existingToDoItem.setDuedate(toDoItem.getDuedate());
                }
                if (toDoItem.getCompletetiondate() != null) {
                    existingToDoItem.setCompletetiondate(toDoItem.getCompletetiondate());
                }

                return existingToDoItem;
            })
            .map(toDoItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, toDoItem.getId())
        );
    }

    /**
     * {@code GET  /to-do-items} : get all the toDoItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of toDoItems in body.
     */
    @GetMapping("")
    public List<ToDoItem> getAllToDoItems() {
        LOG.debug("REST request to get all ToDoItems");
        return toDoItemRepository.findAll();
    }

    /**
     * {@code GET  /to-do-items/:id} : get the "id" toDoItem.
     *
     * @param id the id of the toDoItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the toDoItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ToDoItem> getToDoItem(@PathVariable("id") String id) {
        LOG.debug("REST request to get ToDoItem : {}", id);
        Optional<ToDoItem> toDoItem = toDoItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(toDoItem);
    }

    /**
     * {@code DELETE  /to-do-items/:id} : delete the "id" toDoItem.
     *
     * @param id the id of the toDoItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteToDoItem(@PathVariable("id") String id) {
        LOG.debug("REST request to delete ToDoItem : {}", id);
        toDoItemRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
