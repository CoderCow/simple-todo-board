import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from "@angular/material";
import { ITodoItem } from "../../../../models/ITodoItem";

@Component({
  selector: 'app-cofirm-delete-dialog',
  templateUrl: './cofirm-delete-dialog.component.html',
  styleUrls: ['./cofirm-delete-dialog.component.scss']
})
export class CofirmDeleteDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public todoItem: ITodoItem
  ) {}
}
