import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Todo, TodoService} from "../todo.service";

@Component({
  selector: 'app-todo-item',
  template: `
      <div class="task-indicator" (click)="onRemove()">
        {{ item.task }}
        <span *ngIf="removing" class="removing">[⏳ Removing...]</span>
        <span *ngIf="removed" class="removing">[Deleted successfully.]</span>
        <span *ngIf="error" class="error">{{ error }}</span>
      </div>
      <div class="priority-indicator" [style.background-color]="color">
        {{ item.priority }}
      </div>
  `,
  styleUrls: ['todo-item.component.scss']
})
export class TodoItemComponent {

  @Input() item!: Todo;
  @Output() remove = new EventEmitter<Todo>();

  removing = false;
  removed = false;
  error = '';

  constructor(private todoService: TodoService) {}
  
  get color() {
    switch (this.item.priority) {
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
    }
  }

  onRemove() {
    this.removing = true;
    this.error = '';

    this.todoService.remove(this.item.id).subscribe({
      next: () => {
        this.remove.emit(this.item);
        this.removing = false;
        this.removed = true;
      },
      error: err => {
        console.error('Failed to remove todo', err);
        this.error = '[Failed to remove. Try again.]';
        this.removing = false;
      }
    });
  }
}
