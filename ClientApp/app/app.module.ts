import { AppRoutingModule } from './app-routing.module';
import { TodoBoardModule } from './containers/todo-board/todo-board.module';
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { BrowserModule } from "@angular/platform-browser";
import { CoreModule } from './core/core.module';

import { AppComponent } from "./app.component";

// drag and drop
// https://github.com/akserg/ng2-dnd
import { DndModule } from "ng2-dnd";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CoreModule,
    AppRoutingModule,
    DndModule.forRoot(),

    TodoBoardModule
  ],
  providers: []
})
export class AppModuleShared {}
