import { ITodoItemViewModel } from './../../../models/ITodoItemViewModel';
import { Component, Inject, Input } from '@angular/core';
import { ITodoGroup } from '../../../models/ITodoGroup';
import { ITodoItem } from "../../../models/ITodoItem";
import { CofirmDeleteDialogComponent } from "./cofirm-delete-dialog/cofirm-delete-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material";

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

    this.group.todos.splice(0, 0, item);
    item.groupId = this.group.id;
  }

  // region Item Deleting
  public async deleteItem(todoItem: ITodoItemViewModel): Promise<any> {
    let itemIndex = this.group.todos.indexOf(todoItem);
    if (itemIndex === -1) {
      console.error(`item with index ${itemIndex} not found!`);
      return;
    }

    if (await this.confirmDelete(todoItem))
      this.group.todos.splice(itemIndex, 1);
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
}
