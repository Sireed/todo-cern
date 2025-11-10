import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable} from "rxjs";
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
      <input id="search" type="text">
      <app-progress-bar *ngIf="loading$ | async"></app-progress-bar>
      <app-todo-item *ngFor="let todo of todos$ | async" [item]="todo"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  readonly todos$: Observable<Todo[]>;
  loading$: Observable<boolean>;


  constructor(todoService: TodoService) {    
    this.todos$ = todoService.getAll();

    this.loading$ = this.todos$.pipe(map(() => false), startWith(true));
  }
}
