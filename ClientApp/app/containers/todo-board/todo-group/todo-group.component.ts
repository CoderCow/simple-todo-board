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
  private static newItemTemplate: Readonly<ITodoItem> = Object.freeze({
    id: -1,
    title: 'New Task',
    description: 'Add a task description here.',
    isBeingEdited: false
  });

  @Input()
  public group: ITodoGroup;

  @Input()
  public allowAdd: boolean = false;

  @Input()
  public containsDoneCards: boolean = false;

  constructor(
    public confirmDeleteDialog: MatDialog
  ) {}

  public addItem(item: ITodoItem = undefined) {
    if (!item)
      item = Object.assign({}, TodoGroupComponent.newItemTemplate);

    this.group.todos.splice(0, 0, item);
  }

  // region Item Deleting
  public async deleteItem(todoItem: ITodoItem): Promise<any> {
    let itemIndex = this.group.todos.indexOf(todoItem);
    if (itemIndex === -1) {
      console.error(`item with index ${itemIndex} not found!`);
      return;
    }

    if (await this.confirmDelete(todoItem))
      this.group.todos.splice(itemIndex, 1);
  }

  private async confirmDelete(todoItem: ITodoItem): Promise<boolean> {
    let dialogRef: MatDialogRef<CofirmDeleteDialogComponent>;
    dialogRef = this.confirmDeleteDialog.open(CofirmDeleteDialogComponent, {
      data: todoItem
    });

    const result = await dialogRef.afterClosed().toPromise();
    return result === "true";
  }
  // endregion
}
