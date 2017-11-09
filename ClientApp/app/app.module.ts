import { NgModule } from "@angular/core";
import { RouterModule, PreloadAllModules } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { CoreModule } from './core/core.module';

// drag and drop
// https://github.com/akserg/ng2-dnd
import { DndModule } from "ng2-dnd";

import { AppComponent } from "./app.component";
import { TodoBoardComponent } from "./containers/todo-board/todo-board.component";

import { TodoGroupComponent } from "./containers/todo-board/todo-group/todo-group.component";
import { TodoItemComponent } from "./containers/todo-board/todo-item/todo-item.component";
import { CofirmDeleteDialogComponent } from "./containers/todo-board/todo-group/cofirm-delete-dialog/cofirm-delete-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    TodoBoardComponent,
    TodoGroupComponent,
    TodoItemComponent,
    CofirmDeleteDialogComponent,
  ],
  imports: [
    CoreModule,
    BrowserModule,
    DndModule.forRoot(),

    // App Routing
    RouterModule.forRoot([
        {
          path: "",
          redirectTo: "todo-board",
          pathMatch: "full"
        },
        {
          path: "todo-board",
          component: TodoBoardComponent,

          data: {
            title: "Todo Board"
          }
        }
      ],
      {
        // Router options
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        initialNavigation: "enabled"
      })
  ],
  providers: [],
  entryComponents: [
    CofirmDeleteDialogComponent
  ]
})
export class AppModuleShared {}
