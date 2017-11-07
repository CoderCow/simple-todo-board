import { Component, Input } from '@angular/core';
import { ITodoGroup } from '../../models/ITodoGroup';
import { ITodoItem } from "../../models/ITodoItem";

@Component({
  selector: 'todo-group',
  templateUrl: './todo-group.component.html',
  styleUrls: ['./todo-group.component.scss']
})
export class TodoGroupComponent {
  @Input()
  public group: ITodoGroup;

  constructor() {}

  public deleteItem(item: ITodoItem) {
    let itemIndex = this.group.todos.indexOf(item);
    if (itemIndex > -1)
      this.group.todos.splice(itemIndex, 1);
  }
}
