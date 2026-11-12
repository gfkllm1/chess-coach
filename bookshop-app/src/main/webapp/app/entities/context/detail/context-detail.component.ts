import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatePipe, FormatMediumDatetimePipe } from 'app/shared/date';
import { IContext } from '../context.model';

@Component({
  standalone: true,
  selector: 'jhi-context-detail',
  templateUrl: './context-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class ContextDetailComponent {
  context = input<IContext | null>(null);

  previousState(): void {
    window.history.back();
  }
}
