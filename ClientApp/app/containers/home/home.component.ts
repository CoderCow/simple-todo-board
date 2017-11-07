import { Component, OnInit, Inject } from "@angular/core";

import { TranslateService } from "@ngx-translate/core";
import { ITodoGroup } from "../../models/ITodoGroup";
import { ITodoItem } from "../../models/ITodoItem";

var exampleTodoItems: ITodoItem[] = [
  {
    id: 0,
    title: "Todo Item 1",
    description: "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr.\nSed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
  },
  {
    id: 1,
    title: "Todo Item 2",
    description: "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr."
  },
  {
    id: 2,
    title: "Todo Item 3",
    description: "Lorem ipsumLorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat."
  }
];

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
  public title = "Angular 4.0 Universal & ASP.NET Core 2.0 advanced starter-kit";
  public todoGroup: ITodoGroup = { id: 0, title: "Todo", todos: exampleTodoItems };
  public doingGroup: ITodoGroup = { id: 1, title: "Doing", todos: [] };
  public doneGroup: ITodoGroup = { id: 2, title: "Done", todos: [] };

  // Use "constructor"s only for dependency injection
  constructor(
    public translate: TranslateService
  ) {}

  // Here you want to handle anything with @Input()'s @Output()'s
  // Data retrieval / etc - this is when the Component is "ready" and wired up
  public ngOnInit() {}

  public setLanguage(lang) {
    this.translate.use(lang);
  }
}
