import { ITodoItemViewModel } from './../../models/ITodoItemViewModel';
import { Component, OnInit } from "@angular/core";

import { ITodoGroup } from "../../models/ITodoGroup";
import { ITodoItem } from "../../models/ITodoItem";

var exampleTodoItems: ITodoItem[] = [
  {
    id: 0,
    title: "Todo Item 1",
    descriptionHtml: "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr.\nSed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
    userOrder: 0,
    isBeingEdited: false
  },
  {
    id: 1,
    title: "Todo Item 2",
    descriptionHtml: "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr.",
    userOrder: 1,
    isBeingEdited: false
  },
  {
    id: 2,
    title: "Todo Item 3",
    descriptionHtml: "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
    userOrder: 2,
    isBeingEdited: false
  }
];

@Component({
  selector: "app-home",
  templateUrl: "./todo-board.component.html"
})
export class TodoBoardComponent implements OnInit {
  public todoGroup: ITodoGroup = { id: 0, title: "Todo", todos: exampleTodoItems, userOrder: 0 };
  public doingGroup: ITodoGroup = { id: 1, title: "Doing", todos: [], userOrder: 1 };
  public doneGroup: ITodoGroup = { id: 2, title: "Done", todos: [], userOrder: 2 };

  // Use "constructor"s only for dependency injection
  constructor() {}

  // Here you want to handle anything with @Input()'s @Output()'s
  // Data retrieval / etc - this is when the Component is "ready" and wired up
  public ngOnInit() {}
}
