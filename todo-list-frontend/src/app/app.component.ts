import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {BehaviorSubject, combineLatest, Observable, of} from "rxjs";
import { catchError, map, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
      <input
        id="search"
        type="text"
        [value]="search$.value"
        (input)="onInput($event)"
        placeholder="Type to filter todos"
      />
      <app-progress-bar *ngIf="loading$ | async"></app-progress-bar>
      <p class="deletionMessage">{{ deletionMessage }}</p>
      <app-todo-item
        *ngFor="let todo of (filteredTodos$ | async) ?? []"
        [item]="todo"
        (remove)="onRemove($event)"
      ></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  readonly todos$: Observable<Todo[]>;
  filteredTodos$: Observable<Todo[]>;
  loading$: Observable<boolean>;
  search$ = new BehaviorSubject<string>('');
  refresh$ = new BehaviorSubject<void>(undefined);
  deletionMessage = "Click on a todo to remove it.";


  constructor(private todoService: TodoService) {    
    this.todos$ = this.refresh$.pipe(
      switchMap(() =>
        this.todoService.getAll().pipe(
          catchError(err => {
            this.deletionMessage = 'Failed to load todos.';
            console.error(err);
            return of([]);
          })
        )
      )
    );

    this.loading$ = this.todos$.pipe(map(() => false), startWith(true));

    this.filteredTodos$ = combineLatest([this.todos$, this.search$]).pipe(
      map(([todos, search]) =>
        todos.filter(todo =>
          todo.task.toLowerCase().includes(search.toLowerCase())
        )
      )
    );
  }
  
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement)?.value ?? '';
    this.search$.next(value);
  }

  onRemove(todo: Todo) {
    this.refresh$.next();
  }
}
