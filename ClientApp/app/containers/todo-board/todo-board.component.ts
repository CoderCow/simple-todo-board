import { TodoGroupService } from './../../core/services/todo-group.service';
import { ITodoItemViewModel } from './../../models/ITodoItemViewModel';
import { Component, OnInit } from "@angular/core";

import { ITodoGroup } from "../../models/ITodoGroup";
import { ITodoItem } from "../../models/ITodoItem";

@Component({
  selector: "app-home",
  templateUrl: "./todo-board.component.html",
  styleUrls: ["./todo-board.component.scss"]
})
export class TodoBoardComponent implements OnInit {
  public isLoading: boolean = true;
  public todoGroups: ITodoGroup[];

  constructor(
    public groupService: TodoGroupService
  ) {}

  public ngOnInit() {
    this.groupService.getGroups().subscribe(groups => {
      this.todoGroups = groups;
      this.isLoading = false;
    });
  }
}
