import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import { IToDoItem } from '../to-do-item.model';
import { ToDoItemService } from '../service/to-do-item.service';

@Component({
  standalone: true,
  templateUrl: './to-do-item-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class ToDoItemDeleteDialogComponent {
  toDoItem?: IToDoItem;

  protected toDoItemService = inject(ToDoItemService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.toDoItemService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
