import { Component, Input } from '@angular/core';
import { ITodoGroup } from '../../models/ITodoGroup';
import { ITodoItem } from "../../models/ITodoItem";

@Component({
  selector: 'todo-group',
  templateUrl: './todo-group.component.html',
  styleUrls: ['./todo-group.component.scss']
})
export class TodoGroupComponent {
  private static newItemTemplate: Readonly<ITodoItem> = Object.freeze({
    id: -1,
    title: 'Todo',
    description: 'Fill me'
  });

  @Input()
  public group: ITodoGroup;
  @Input()
  public allowAdd: boolean = false;
  @Input()
  public containsDoneCards: boolean = false;

  constructor() {}

  public addItem(item: ITodoItem = null) {
    if (!item)
      item = Object.assign({}, TodoGroupComponent.newItemTemplate);

    this.group.todos.splice(0, 0, item);
  }

  public deleteItem(item: ITodoItem) {
    let itemIndex = this.group.todos.indexOf(item);
    if (itemIndex > -1)
      this.group.todos.splice(itemIndex, 1);
  }
}
