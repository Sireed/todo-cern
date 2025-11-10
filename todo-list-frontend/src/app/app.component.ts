import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {BehaviorSubject, combineLatest, Observable} from "rxjs";
import { map, startWith } from 'rxjs/operators';

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
      <app-todo-item
        *ngFor="let todo of (filteredTodos$ | async) ?? []"
        [item]="todo"
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


  constructor(todoService: TodoService) {    
    this.todos$ = todoService.getAll();

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
}
