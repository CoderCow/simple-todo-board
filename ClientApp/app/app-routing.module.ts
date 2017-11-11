import { PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todo-board' }
];
const routerConfig = {
  useHash: false,
  preloadingStrategy: PreloadAllModules,
  InitialNavigation: "enabled"
};

export const AppRoutingModule = RouterModule.forRoot(routes, routerConfig);
