import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IToDoItem } from '../to-do-item.model';
import { ToDoItemService } from '../service/to-do-item.service';

const toDoItemResolve = (route: ActivatedRouteSnapshot): Observable<null | IToDoItem> => {
  const id = route.params.id;
  if (id) {
    return inject(ToDoItemService)
      .find(id)
      .pipe(
        mergeMap((toDoItem: HttpResponse<IToDoItem>) => {
          if (toDoItem.body) {
            return of(toDoItem.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default toDoItemResolve;
