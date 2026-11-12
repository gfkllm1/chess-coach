package com.mycompany.myapp.web.rest;

import static com.mycompany.myapp.domain.ToDoItemAsserts.*;
import static com.mycompany.myapp.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.ToDoItem;
import com.mycompany.myapp.repository.ToDoItemRepository;
import jakarta.persistence.EntityManager;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.UUID;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ToDoItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ToDoItemResourceIT {

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final LocalDate DEFAULT_DUEDATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_DUEDATE = LocalDate.now(ZoneId.systemDefault());

    private static final LocalDate DEFAULT_COMPLETETIONDATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_COMPLETETIONDATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/to-do-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ToDoItemRepository toDoItemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restToDoItemMockMvc;

    private ToDoItem toDoItem;

    private ToDoItem insertedToDoItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ToDoItem createEntity() {
        return new ToDoItem().description(DEFAULT_DESCRIPTION).duedate(DEFAULT_DUEDATE).completetiondate(DEFAULT_COMPLETETIONDATE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static ToDoItem createUpdatedEntity() {
        return new ToDoItem().description(UPDATED_DESCRIPTION).duedate(UPDATED_DUEDATE).completetiondate(UPDATED_COMPLETETIONDATE);
    }

    @BeforeEach
    public void initTest() {
        toDoItem = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedToDoItem != null) {
            toDoItemRepository.delete(insertedToDoItem);
            insertedToDoItem = null;
        }
    }

    @Test
    @Transactional
    void createToDoItem() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the ToDoItem
        var returnedToDoItem = om.readValue(
            restToDoItemMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(toDoItem)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            ToDoItem.class
        );

        // Validate the ToDoItem in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertToDoItemUpdatableFieldsEquals(returnedToDoItem, getPersistedToDoItem(returnedToDoItem));

        insertedToDoItem = returnedToDoItem;
    }

    @Test
    @Transactional
    void createToDoItemWithExistingId() throws Exception {
        // Create the ToDoItem with an existing ID
        toDoItem.setId("existing_id");

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restToDoItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(toDoItem)))
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllToDoItems() throws Exception {
        // Initialize the database
        insertedToDoItem = toDoItemRepository.saveAndFlush(toDoItem);

        // Get all the toDoItemList
        restToDoItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(toDoItem.getId())))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].duedate").value(hasItem(DEFAULT_DUEDATE.toString())))
            .andExpect(jsonPath("$.[*].completetiondate").value(hasItem(DEFAULT_COMPLETETIONDATE.toString())));
    }

    @Test
    @Transactional
    void getToDoItem() throws Exception {
        // Initialize the database
        insertedToDoItem = toDoItemRepository.saveAndFlush(toDoItem);

        // Get the toDoItem
        restToDoItemMockMvc
            .perform(get(ENTITY_API_URL_ID, toDoItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(toDoItem.getId()))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.duedate").value(DEFAULT_DUEDATE.toString()))
            .andExpect(jsonPath("$.completetiondate").value(DEFAULT_COMPLETETIONDATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingToDoItem() throws Exception {
        // Get the toDoItem
        restToDoItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingToDoItem() throws Exception {
        // Initialize the database
        insertedToDoItem = toDoItemRepository.saveAndFlush(toDoItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the toDoItem
        ToDoItem updatedToDoItem = toDoItemRepository.findById(toDoItem.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedToDoItem are not directly saved in db
        em.detach(updatedToDoItem);
        updatedToDoItem.description(UPDATED_DESCRIPTION).duedate(UPDATED_DUEDATE).completetiondate(UPDATED_COMPLETETIONDATE);

        restToDoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedToDoItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedToDoItem))
            )
            .andExpect(status().isOk());

        // Validate the ToDoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedToDoItemToMatchAllProperties(updatedToDoItem);
    }

    @Test
    @Transactional
    void putNonExistingToDoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        toDoItem.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, toDoItem.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(toDoItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchToDoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        toDoItem.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(toDoItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamToDoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        toDoItem.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(toDoItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ToDoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateToDoItemWithPatch() throws Exception {
        // Initialize the database
        insertedToDoItem = toDoItemRepository.saveAndFlush(toDoItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the toDoItem using partial update
        ToDoItem partialUpdatedToDoItem = new ToDoItem();
        partialUpdatedToDoItem.setId(toDoItem.getId());

        partialUpdatedToDoItem.description(UPDATED_DESCRIPTION).duedate(UPDATED_DUEDATE).completetiondate(UPDATED_COMPLETETIONDATE);

        restToDoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedToDoItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedToDoItem))
            )
            .andExpect(status().isOk());

        // Validate the ToDoItem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertToDoItemUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedToDoItem, toDoItem), getPersistedToDoItem(toDoItem));
    }

    @Test
    @Transactional
    void fullUpdateToDoItemWithPatch() throws Exception {
        // Initialize the database
        insertedToDoItem = toDoItemRepository.saveAndFlush(toDoItem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the toDoItem using partial update
        ToDoItem partialUpdatedToDoItem = new ToDoItem();
        partialUpdatedToDoItem.setId(toDoItem.getId());

        partialUpdatedToDoItem.description(UPDATED_DESCRIPTION).duedate(UPDATED_DUEDATE).completetiondate(UPDATED_COMPLETETIONDATE);

        restToDoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedToDoItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedToDoItem))
            )
            .andExpect(status().isOk());

        // Validate the ToDoItem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertToDoItemUpdatableFieldsEquals(partialUpdatedToDoItem, getPersistedToDoItem(partialUpdatedToDoItem));
    }

    @Test
    @Transactional
    void patchNonExistingToDoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        toDoItem.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, toDoItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(toDoItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchToDoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        toDoItem.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(toDoItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the ToDoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamToDoItem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        toDoItem.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restToDoItemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(toDoItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the ToDoItem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteToDoItem() throws Exception {
        // Initialize the database
        insertedToDoItem = toDoItemRepository.saveAndFlush(toDoItem);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the toDoItem
        restToDoItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, toDoItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return toDoItemRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected ToDoItem getPersistedToDoItem(ToDoItem toDoItem) {
        return toDoItemRepository.findById(toDoItem.getId()).orElseThrow();
    }

    protected void assertPersistedToDoItemToMatchAllProperties(ToDoItem expectedToDoItem) {
        assertToDoItemAllPropertiesEquals(expectedToDoItem, getPersistedToDoItem(expectedToDoItem));
    }

    protected void assertPersistedToDoItemToMatchUpdatableProperties(ToDoItem expectedToDoItem) {
        assertToDoItemAllUpdatablePropertiesEquals(expectedToDoItem, getPersistedToDoItem(expectedToDoItem));
    }
}
