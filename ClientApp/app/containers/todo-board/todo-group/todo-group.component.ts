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
    isBeingEdited: false,
    isBusy: true
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

  public async addItem(item: ITodoItemViewModel = undefined) {
    if (!item)
      item = Object.assign({}, TodoGroupComponent.newItemTemplate);

    item.groupId = this.group.id;

    // TODO: rollback if adding fails
    this.group.todos.forEach(i => i.userOrder++);
    this.group.todos.splice(0, 0, item);

    let addedItem: ITodoItem = await this.todoItemService.addItem(item).toPromise();
    item.id = addedItem.id;
    item.isBusy = false;
  }

  // region Item Deleting
  public async deleteItem(todoItem: ITodoItemViewModel): Promise<any> {
    let itemIndex = this.group.todos.indexOf(todoItem);
    if (itemIndex === -1) {
      console.error(`item with index ${itemIndex} not found!`);
      return;
    }

    if (await this.confirmDelete(todoItem)) {
      todoItem.isBusy = true;
      todoItem.isBeingEdited = false;

      // TODO: rollback if update fails
      this.group.todos.splice(itemIndex, 1);
      for (let i = itemIndex + 1; i < this.group.todos.length; i++)
        this.group.todos[i].userOrder--;

      await this.todoItemService.removeItem(todoItem.id).toPromise();
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

  // TODO: roll the move operation back if update fails
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

    todoItem.isBusy = true;
    await this.todoItemService.updateItem(todoItem.id, itemUpdates).toPromise();
    todoItem.groupId = this.group.id;
    todoItem.isBusy = false;
  }
}
