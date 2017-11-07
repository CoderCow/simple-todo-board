import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ITodoItem } from '../../models/ITodoItem';

@Component({
  selector: 'todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.scss']
})
export class TodoItemComponent {
  @Input()
  public todo: ITodoItem;

  @Output()
  public deleteClicked = new EventEmitter();

  constructor() {}

  public delete() {
    this.deleteClicked.emit();
  }
}
