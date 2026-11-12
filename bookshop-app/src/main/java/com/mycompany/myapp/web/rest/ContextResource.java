package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Context;
import com.mycompany.myapp.repository.ContextRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Context}.
 */
@RestController
@RequestMapping("/api/contexts")
@Transactional
public class ContextResource {

    private static final Logger LOG = LoggerFactory.getLogger(ContextResource.class);

    private static final String ENTITY_NAME = "context";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ContextRepository contextRepository;

    public ContextResource(ContextRepository contextRepository) {
        this.contextRepository = contextRepository;
    }

    /**
     * {@code POST  /contexts} : Create a new context.
     *
     * @param context the context to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new context, or with status {@code 400 (Bad Request)} if the context has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Context> createContext(@Valid @RequestBody Context context) throws URISyntaxException {
        LOG.debug("REST request to save Context : {}", context);
        if (context.getId() != null) {
            throw new BadRequestAlertException("A new context cannot already have an ID", ENTITY_NAME, "idexists");
        }
        context = contextRepository.save(context);
        return ResponseEntity.created(new URI("/api/contexts/" + context.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, context.getId()))
            .body(context);
    }

    /**
     * {@code PUT  /contexts/:id} : Updates an existing context.
     *
     * @param id the id of the context to save.
     * @param context the context to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated context,
     * or with status {@code 400 (Bad Request)} if the context is not valid,
     * or with status {@code 500 (Internal Server Error)} if the context couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Context> updateContext(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Context context
    ) throws URISyntaxException {
        LOG.debug("REST request to update Context : {}, {}", id, context);
        if (context.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, context.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contextRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        context = contextRepository.save(context);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, context.getId()))
            .body(context);
    }

    /**
     * {@code PATCH  /contexts/:id} : Partial updates given fields of an existing context, field will ignore if it is null
     *
     * @param id the id of the context to save.
     * @param context the context to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated context,
     * or with status {@code 400 (Bad Request)} if the context is not valid,
     * or with status {@code 404 (Not Found)} if the context is not found,
     * or with status {@code 500 (Internal Server Error)} if the context couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Context> partialUpdateContext(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Context context
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Context partially : {}, {}", id, context);
        if (context.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, context.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!contextRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Context> result = contextRepository
            .findById(context.getId())
            .map(existingContext -> {
                if (context.getDescrription() != null) {
                    existingContext.setDescrription(context.getDescrription());
                }

                return existingContext;
            })
            .map(contextRepository::save);

        return ResponseUtil.wrapOrNotFound(result, HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, context.getId()));
    }

    /**
     * {@code GET  /contexts} : get all the contexts.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of contexts in body.
     */
    @GetMapping("")
    public List<Context> getAllContexts() {
        LOG.debug("REST request to get all Contexts");
        return contextRepository.findAll();
    }

    /**
     * {@code GET  /contexts/:id} : get the "id" context.
     *
     * @param id the id of the context to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the context, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Context> getContext(@PathVariable("id") String id) {
        LOG.debug("REST request to get Context : {}", id);
        Optional<Context> context = contextRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(context);
    }

    /**
     * {@code DELETE  /contexts/:id} : delete the "id" context.
     *
     * @param id the id of the context to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContext(@PathVariable("id") String id) {
        LOG.debug("REST request to delete Context : {}", id);
        contextRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id)).build();
    }
}
