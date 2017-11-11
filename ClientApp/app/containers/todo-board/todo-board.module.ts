import { NgModule } from '@angular/core';
import { CoreModule } from './../../core/core.module';
import { TodoRoutingModule } from './todo-routing.module';
import { TodoBoardComponent } from './todo-board.component';
import { TodoGroupComponent } from './todo-group/todo-group.component';
import { TodoItemComponent } from './todo-item/todo-item.component';
import { CofirmDeleteDialogComponent } from './todo-group/cofirm-delete-dialog/cofirm-delete-dialog.component';

// drag and drop
// https://github.com/akserg/ng2-dnd
import { DndModule } from "ng2-dnd";

@NgModule({
  imports: [
    CoreModule,
    DndModule,
    TodoRoutingModule
  ],
  declarations: [
    TodoBoardComponent,
    TodoItemComponent,
    TodoGroupComponent,
    CofirmDeleteDialogComponent,
  ],
  entryComponents: [
    CofirmDeleteDialogComponent
  ],
})
export class TodoBoardModule {}
