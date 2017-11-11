import { PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoBoardComponent } from './todo-board.component';

const routes: Routes = [
  { path: 'todo-board', component: TodoBoardComponent }
];

export const TodoRoutingModule = RouterModule.forChild(routes);
