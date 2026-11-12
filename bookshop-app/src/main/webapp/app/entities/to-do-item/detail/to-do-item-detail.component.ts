import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IToDoItem } from '../to-do-item.model';

@Component({
  standalone: true,
  selector: 'jhi-to-do-item-detail',
  templateUrl: './to-do-item-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ToDoItemDetailComponent {
  toDoItem = input<IToDoItem | null>(null);

  previousState(): void {
    window.history.back();
  }
}
