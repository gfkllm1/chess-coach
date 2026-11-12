import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
import { ToDoItemService } from '../service/to-do-item.service';
import { IToDoItem } from '../to-do-item.model';
import { ToDoItemFormGroup, ToDoItemFormService } from './to-do-item-form.service';

@Component({
  standalone: true,
  selector: 'jhi-to-do-item-update',
  templateUrl: './to-do-item-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ToDoItemUpdateComponent implements OnInit {
  isSaving = false;
  toDoItem: IToDoItem | null = null;

  ownersSharedCollection: IOwner[] = [];
  projectsSharedCollection: IProject[] = [];
  contextsSharedCollection: IContext[] = [];
  prioritiesSharedCollection: IPriority[] = [];
  statusesSharedCollection: IStatus[] = [];

  protected toDoItemService = inject(ToDoItemService);
  protected toDoItemFormService = inject(ToDoItemFormService);
  protected ownerService = inject(OwnerService);
  protected projectService = inject(ProjectService);
  protected contextService = inject(ContextService);
  protected priorityService = inject(PriorityService);
  protected statusService = inject(StatusService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ToDoItemFormGroup = this.toDoItemFormService.createToDoItemFormGroup();

  compareOwner = (o1: IOwner | null, o2: IOwner | null): boolean => this.ownerService.compareOwner(o1, o2);

  compareProject = (o1: IProject | null, o2: IProject | null): boolean => this.projectService.compareProject(o1, o2);

  compareContext = (o1: IContext | null, o2: IContext | null): boolean => this.contextService.compareContext(o1, o2);

  comparePriority = (o1: IPriority | null, o2: IPriority | null): boolean => this.priorityService.comparePriority(o1, o2);

  compareStatus = (o1: IStatus | null, o2: IStatus | null): boolean => this.statusService.compareStatus(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ toDoItem }) => {
      this.toDoItem = toDoItem;
      if (toDoItem) {
        this.updateForm(toDoItem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const toDoItem = this.toDoItemFormService.getToDoItem(this.editForm);
    if (toDoItem.id !== null) {
      this.subscribeToSaveResponse(this.toDoItemService.update(toDoItem));
    } else {
      this.subscribeToSaveResponse(this.toDoItemService.create(toDoItem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IToDoItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(toDoItem: IToDoItem): void {
    this.toDoItem = toDoItem;
    this.toDoItemFormService.resetForm(this.editForm, toDoItem);

    this.ownersSharedCollection = this.ownerService.addOwnerToCollectionIfMissing<IOwner>(this.ownersSharedCollection, toDoItem.owner);
    this.projectsSharedCollection = this.projectService.addProjectToCollectionIfMissing<IProject>(
      this.projectsSharedCollection,
      toDoItem.project,
    );
    this.contextsSharedCollection = this.contextService.addContextToCollectionIfMissing<IContext>(
      this.contextsSharedCollection,
      toDoItem.context,
    );
    this.prioritiesSharedCollection = this.priorityService.addPriorityToCollectionIfMissing<IPriority>(
      this.prioritiesSharedCollection,
      toDoItem.priority,
    );
    this.statusesSharedCollection = this.statusService.addStatusToCollectionIfMissing<IStatus>(
      this.statusesSharedCollection,
      toDoItem.status,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.ownerService
      .query()
      .pipe(map((res: HttpResponse<IOwner[]>) => res.body ?? []))
      .pipe(map((owners: IOwner[]) => this.ownerService.addOwnerToCollectionIfMissing<IOwner>(owners, this.toDoItem?.owner)))
      .subscribe((owners: IOwner[]) => (this.ownersSharedCollection = owners));

    this.projectService
      .query()
      .pipe(map((res: HttpResponse<IProject[]>) => res.body ?? []))
      .pipe(map((projects: IProject[]) => this.projectService.addProjectToCollectionIfMissing<IProject>(projects, this.toDoItem?.project)))
      .subscribe((projects: IProject[]) => (this.projectsSharedCollection = projects));

    this.contextService
      .query()
      .pipe(map((res: HttpResponse<IContext[]>) => res.body ?? []))
      .pipe(map((contexts: IContext[]) => this.contextService.addContextToCollectionIfMissing<IContext>(contexts, this.toDoItem?.context)))
      .subscribe((contexts: IContext[]) => (this.contextsSharedCollection = contexts));

    this.priorityService
      .query()
      .pipe(map((res: HttpResponse<IPriority[]>) => res.body ?? []))
      .pipe(
        map((priorities: IPriority[]) =>
          this.priorityService.addPriorityToCollectionIfMissing<IPriority>(priorities, this.toDoItem?.priority),
        ),
      )
      .subscribe((priorities: IPriority[]) => (this.prioritiesSharedCollection = priorities));

    this.statusService
      .query()
      .pipe(map((res: HttpResponse<IStatus[]>) => res.body ?? []))
      .pipe(map((statuses: IStatus[]) => this.statusService.addStatusToCollectionIfMissing<IStatus>(statuses, this.toDoItem?.status)))
      .subscribe((statuses: IStatus[]) => (this.statusesSharedCollection = statuses));
  }
}
