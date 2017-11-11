import { ITodoItemViewModel } from './../../../models/ITodoItemViewModel';
import { Component, Inject, Input } from '@angular/core';
import { ITodoGroup } from '../../../models/ITodoGroup';
import { ITodoItem } from "../../../models/ITodoItem";
import { CofirmDeleteDialogComponent } from "./cofirm-delete-dialog/cofirm-delete-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material";
import { TodoItemService } from '../../../core/services/todo-item.service';

@Component({
  selector: 'todo-group',
  templateUrl: './todo-group.component.html',
  styleUrls: ['./todo-group.component.scss']
})
export class TodoGroupComponent {
  private static newItemTemplate: Readonly<ITodoItemViewModel> = Object.freeze({
    id: -1,
    groupId: -1,
    title: 'New Task',
    descriptionHtml: 'Add a task description here.',
    userOrder: 0,
    isBeingEdited: false
  });

  @Input()
  public group: ITodoGroup;

  @Input()
  public allowAdd: boolean = false;

  @Input()
  public containsDoneCards: boolean = false;

  constructor(
    public confirmDeleteDialog: MatDialog,
    public todoItemService: TodoItemService
  ) {}

  public addItem(item: ITodoItemViewModel = undefined) {
    if (!item)
      item = Object.assign({}, TodoGroupComponent.newItemTemplate);

    item.groupId = this.group.id;

    this.todoItemService.addItem(item).subscribe(addedItem => {
      this.group.todos.forEach(i => i.userOrder++);
      this.group.todos.splice(0, 0, addedItem);
    });
  }

  // region Item Deleting
  public async deleteItem(todoItem: ITodoItemViewModel): Promise<any> {
    let itemIndex = this.group.todos.indexOf(todoItem);
    if (itemIndex === -1) {
      console.error(`item with index ${itemIndex} not found!`);
      return;
    }

    if (await this.confirmDelete(todoItem)) {
      this.todoItemService.removeItem(todoItem.id).subscribe(o => {
        for (let i = itemIndex + 1; i < this.group.todos.length; i++)
          this.group.todos[i].userOrder--;

        this.group.todos.splice(itemIndex, 1);
      });
    }
  }

  private async confirmDelete(todoItem: ITodoItemViewModel): Promise<boolean> {
    let dialogRef: MatDialogRef<CofirmDeleteDialogComponent>;
    dialogRef = this.confirmDeleteDialog.open(CofirmDeleteDialogComponent, {
      data: todoItem
    });

    const result = await dialogRef.afterClosed().toPromise();
    return result === "true";
  }
  // endregion

  public async itemDragEnd(oldIndex: number, todoItem: ITodoItemViewModel, newIndex: number) {
    let nextSibling = this.group.todos[newIndex + 1];
    let prevSibling = this.group.todos[newIndex - 1];

    let newUserOrder;
    let hasGroupChanged = todoItem.groupId !== this.group.id;
    if (hasGroupChanged) {
      for (let i = newIndex + 1; i < this.group.todos.length; i++)
        this.group.todos[i].userOrder++;

      if (nextSibling)
        newUserOrder = nextSibling.userOrder - 1;
      else if (prevSibling)
        newUserOrder = prevSibling.userOrder + 1;
      else
        newUserOrder = 0;
    } else if (newIndex < oldIndex) { // item was moved up
      for (let i = newIndex + 1; i <= oldIndex; i++)
        this.group.todos[i].userOrder++;

      let isFirstInGroup = newIndex === 0;
      if (isFirstInGroup)
        newUserOrder = 0;
      else
        newUserOrder = prevSibling.userOrder + 1;
    } else if (newIndex > oldIndex) { // item was moved down
      for (let i = oldIndex; i < newIndex; i++)
        this.group.todos[i].userOrder--;

      let isLastInGroup = newIndex === this.group.todos.length - 1;
      if (isLastInGroup)
        newUserOrder = prevSibling.userOrder + 1;
      else
        newUserOrder = nextSibling.userOrder - 1;
    }
    todoItem.userOrder = newUserOrder;

    let itemUpdates = {
      userOrder: newUserOrder,
      groupId: this.group.id
    };
    // TODO: roll the move operation back if update fails
    this.todoItemService.updateItem(todoItem.id, itemUpdates).subscribe(o => {
      todoItem.groupId = this.group.id;
    });
  }
}
