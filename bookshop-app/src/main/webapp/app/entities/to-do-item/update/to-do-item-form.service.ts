import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IToDoItem, NewToDoItem } from '../to-do-item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IToDoItem for edit and NewToDoItemFormGroupInput for create.
 */
type ToDoItemFormGroupInput = IToDoItem | PartialWithRequiredKeyOf<NewToDoItem>;

type ToDoItemFormDefaults = Pick<NewToDoItem, 'id'>;

type ToDoItemFormGroupContent = {
  id: FormControl<IToDoItem['id'] | NewToDoItem['id']>;
  description: FormControl<IToDoItem['description']>;
  duedate: FormControl<IToDoItem['duedate']>;
  completetiondate: FormControl<IToDoItem['completetiondate']>;
  owner: FormControl<IToDoItem['owner']>;
  project: FormControl<IToDoItem['project']>;
  context: FormControl<IToDoItem['context']>;
  priority: FormControl<IToDoItem['priority']>;
  status: FormControl<IToDoItem['status']>;
};

export type ToDoItemFormGroup = FormGroup<ToDoItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ToDoItemFormService {
  createToDoItemFormGroup(toDoItem: ToDoItemFormGroupInput = { id: null }): ToDoItemFormGroup {
    const toDoItemRawValue = {
      ...this.getFormDefaults(),
      ...toDoItem,
    };
    return new FormGroup<ToDoItemFormGroupContent>({
      id: new FormControl(
        { value: toDoItemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      description: new FormControl(toDoItemRawValue.description),
      duedate: new FormControl(toDoItemRawValue.duedate),
      completetiondate: new FormControl(toDoItemRawValue.completetiondate),
      owner: new FormControl(toDoItemRawValue.owner),
      project: new FormControl(toDoItemRawValue.project),
      context: new FormControl(toDoItemRawValue.context),
      priority: new FormControl(toDoItemRawValue.priority),
      status: new FormControl(toDoItemRawValue.status),
    });
  }

  getToDoItem(form: ToDoItemFormGroup): IToDoItem | NewToDoItem {
    return form.getRawValue() as IToDoItem | NewToDoItem;
  }

  resetForm(form: ToDoItemFormGroup, toDoItem: ToDoItemFormGroupInput): void {
    const toDoItemRawValue = { ...this.getFormDefaults(), ...toDoItem };
    form.reset(
      {
        ...toDoItemRawValue,
        id: { value: toDoItemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ToDoItemFormDefaults {
    return {
      id: null,
    };
  }
}
