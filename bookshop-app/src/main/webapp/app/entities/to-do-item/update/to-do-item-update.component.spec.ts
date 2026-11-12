import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IOwner } from 'app/entities/owner/owner.model';
import { OwnerService } from 'app/entities/owner/service/owner.service';
import { IProject } from 'app/entities/project/project.model';
import { ProjectService } from 'app/entities/project/service/project.service';
import { IContext } from 'app/entities/context/context.model';
import { ContextService } from 'app/entities/context/service/context.service';
import { IPriority } from 'app/entities/priority/priority.model';
import { PriorityService } from 'app/entities/priority/service/priority.service';
import { IStatus } from 'app/entities/status/status.model';
import { StatusService } from 'app/entities/status/service/status.service';
import { IToDoItem } from '../to-do-item.model';
import { ToDoItemService } from '../service/to-do-item.service';
import { ToDoItemFormService } from './to-do-item-form.service';

import { ToDoItemUpdateComponent } from './to-do-item-update.component';

describe('ToDoItem Management Update Component', () => {
  let comp: ToDoItemUpdateComponent;
  let fixture: ComponentFixture<ToDoItemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let toDoItemFormService: ToDoItemFormService;
  let toDoItemService: ToDoItemService;
  let ownerService: OwnerService;
  let projectService: ProjectService;
  let contextService: ContextService;
  let priorityService: PriorityService;
  let statusService: StatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ToDoItemUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(ToDoItemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ToDoItemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    toDoItemFormService = TestBed.inject(ToDoItemFormService);
    toDoItemService = TestBed.inject(ToDoItemService);
    ownerService = TestBed.inject(OwnerService);
    projectService = TestBed.inject(ProjectService);
    contextService = TestBed.inject(ContextService);
    priorityService = TestBed.inject(PriorityService);
    statusService = TestBed.inject(StatusService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Owner query and add missing value', () => {
      const toDoItem: IToDoItem = { id: 'CBA' };
      const owner: IOwner = { id: '8b723a76-8550-4dc9-aeab-333a5ac071b7' };
      toDoItem.owner = owner;

      const ownerCollection: IOwner[] = [{ id: '2546492b-c0cc-4360-96fe-47000ea4a8fb' }];
      jest.spyOn(ownerService, 'query').mockReturnValue(of(new HttpResponse({ body: ownerCollection })));
      const additionalOwners = [owner];
      const expectedCollection: IOwner[] = [...additionalOwners, ...ownerCollection];
      jest.spyOn(ownerService, 'addOwnerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(ownerService.query).toHaveBeenCalled();
      expect(ownerService.addOwnerToCollectionIfMissing).toHaveBeenCalledWith(
        ownerCollection,
        ...additionalOwners.map(expect.objectContaining),
      );
      expect(comp.ownersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Project query and add missing value', () => {
      const toDoItem: IToDoItem = { id: 'CBA' };
      const project: IProject = { id: '6a1c439b-3987-4fa6-a66d-16cc423856f6' };
      toDoItem.project = project;

      const projectCollection: IProject[] = [{ id: '26e4470a-b321-4057-b022-ef31356a5e66' }];
      jest.spyOn(projectService, 'query').mockReturnValue(of(new HttpResponse({ body: projectCollection })));
      const additionalProjects = [project];
      const expectedCollection: IProject[] = [...additionalProjects, ...projectCollection];
      jest.spyOn(projectService, 'addProjectToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(projectService.query).toHaveBeenCalled();
      expect(projectService.addProjectToCollectionIfMissing).toHaveBeenCalledWith(
        projectCollection,
        ...additionalProjects.map(expect.objectContaining),
      );
      expect(comp.projectsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Context query and add missing value', () => {
      const toDoItem: IToDoItem = { id: 'CBA' };
      const context: IContext = { id: '0a85ac51-fbf8-43a4-92a6-f4cb6c7c478d' };
      toDoItem.context = context;

      const contextCollection: IContext[] = [{ id: '6747d975-1ccc-43e0-bfaa-6e560656d008' }];
      jest.spyOn(contextService, 'query').mockReturnValue(of(new HttpResponse({ body: contextCollection })));
      const additionalContexts = [context];
      const expectedCollection: IContext[] = [...additionalContexts, ...contextCollection];
      jest.spyOn(contextService, 'addContextToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(contextService.query).toHaveBeenCalled();
      expect(contextService.addContextToCollectionIfMissing).toHaveBeenCalledWith(
        contextCollection,
        ...additionalContexts.map(expect.objectContaining),
      );
      expect(comp.contextsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Priority query and add missing value', () => {
      const toDoItem: IToDoItem = { id: 'CBA' };
      const priority: IPriority = { id: 23079 };
      toDoItem.priority = priority;

      const priorityCollection: IPriority[] = [{ id: 12420 }];
      jest.spyOn(priorityService, 'query').mockReturnValue(of(new HttpResponse({ body: priorityCollection })));
      const additionalPriorities = [priority];
      const expectedCollection: IPriority[] = [...additionalPriorities, ...priorityCollection];
      jest.spyOn(priorityService, 'addPriorityToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(priorityService.query).toHaveBeenCalled();
      expect(priorityService.addPriorityToCollectionIfMissing).toHaveBeenCalledWith(
        priorityCollection,
        ...additionalPriorities.map(expect.objectContaining),
      );
      expect(comp.prioritiesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Status query and add missing value', () => {
      const toDoItem: IToDoItem = { id: 'CBA' };
      const status: IStatus = { id: 24721 };
      toDoItem.status = status;

      const statusCollection: IStatus[] = [{ id: 30101 }];
      jest.spyOn(statusService, 'query').mockReturnValue(of(new HttpResponse({ body: statusCollection })));
      const additionalStatuses = [status];
      const expectedCollection: IStatus[] = [...additionalStatuses, ...statusCollection];
      jest.spyOn(statusService, 'addStatusToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(statusService.query).toHaveBeenCalled();
      expect(statusService.addStatusToCollectionIfMissing).toHaveBeenCalledWith(
        statusCollection,
        ...additionalStatuses.map(expect.objectContaining),
      );
      expect(comp.statusesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const toDoItem: IToDoItem = { id: 'CBA' };
      const owner: IOwner = { id: '22d93f29-02ec-415e-857f-e34c883a0533' };
      toDoItem.owner = owner;
      const project: IProject = { id: '1b213c1d-d0e1-4e6b-bf5a-f4a3f753bc40' };
      toDoItem.project = project;
      const context: IContext = { id: '195fb137-a3ce-4ba6-8ad5-c1f986f34a47' };
      toDoItem.context = context;
      const priority: IPriority = { id: 12276 };
      toDoItem.priority = priority;
      const status: IStatus = { id: 22942 };
      toDoItem.status = status;

      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      expect(comp.ownersSharedCollection).toContain(owner);
      expect(comp.projectsSharedCollection).toContain(project);
      expect(comp.contextsSharedCollection).toContain(context);
      expect(comp.prioritiesSharedCollection).toContain(priority);
      expect(comp.statusesSharedCollection).toContain(status);
      expect(comp.toDoItem).toEqual(toDoItem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IToDoItem>>();
      const toDoItem = { id: 'ABC' };
      jest.spyOn(toDoItemFormService, 'getToDoItem').mockReturnValue(toDoItem);
      jest.spyOn(toDoItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: toDoItem }));
      saveSubject.complete();

      // THEN
      expect(toDoItemFormService.getToDoItem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(toDoItemService.update).toHaveBeenCalledWith(expect.objectContaining(toDoItem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IToDoItem>>();
      const toDoItem = { id: 'ABC' };
      jest.spyOn(toDoItemFormService, 'getToDoItem').mockReturnValue({ id: null });
      jest.spyOn(toDoItemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ toDoItem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: toDoItem }));
      saveSubject.complete();

      // THEN
      expect(toDoItemFormService.getToDoItem).toHaveBeenCalled();
      expect(toDoItemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IToDoItem>>();
      const toDoItem = { id: 'ABC' };
      jest.spyOn(toDoItemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ toDoItem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(toDoItemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareOwner', () => {
      it('Should forward to ownerService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(ownerService, 'compareOwner');
        comp.compareOwner(entity, entity2);
        expect(ownerService.compareOwner).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareProject', () => {
      it('Should forward to projectService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(projectService, 'compareProject');
        comp.compareProject(entity, entity2);
        expect(projectService.compareProject).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareContext', () => {
      it('Should forward to contextService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(contextService, 'compareContext');
        comp.compareContext(entity, entity2);
        expect(contextService.compareContext).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePriority', () => {
      it('Should forward to priorityService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(priorityService, 'comparePriority');
        comp.comparePriority(entity, entity2);
        expect(priorityService.comparePriority).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareStatus', () => {
      it('Should forward to statusService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(statusService, 'compareStatus');
        comp.compareStatus(entity, entity2);
        expect(statusService.compareStatus).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
