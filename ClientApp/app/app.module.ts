import { NgModule, Inject } from "@angular/core";
import { RouterModule, PreloadAllModules } from "@angular/router";
import { CommonModule, APP_BASE_HREF } from "@angular/common";
import { HttpModule, Http } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { Ng2BootstrapModule } from "ngx-bootstrap";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./components/navmenu/navmenu.component";
import { HomeComponent } from "./containers/home/home.component";

// import { ConnectionResolver } from './shared/route.resolver';
import { ORIGIN_URL } from "./shared/constants/baseurl.constants";
import { TransferHttpModule } from "../modules/transfer-http/transfer-http.module";

// https://github.com/angular/flex-layout/wiki/Fast-Starts
import { FlexLayoutModule } from "@angular/flex-layout";

// material design
import { BrowserModule } from '@angular/platform-browser';
import {
  MatAutocompleteModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatStepperModule,
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { TodoGroupComponent } from './components/todo-group/todo-group.component';
import { TodoItemComponent } from './components/todo-item/todo-item.component';

@NgModule({
  exports: [
    CdkTableModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  ]
})
export class MaterialModule {}

// autoresize for textareas
// https://github.com/stevepapa/angular2-autosize
import { Autosize } from 'angular2-autosize';

// drag and drop
// https://github.com/akserg/ng2-dnd
import { DndModule } from 'ng2-dnd';
import { CofirmDeleteDialogComponent } from "./components/todo-group/cofirm-delete-dialog/cofirm-delete-dialog.component";

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    TodoGroupComponent,
    TodoItemComponent,
    CofirmDeleteDialogComponent,
    Autosize,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpModule,
    FormsModule,
    Ng2BootstrapModule.forRoot(), // You could also split this up if you don't want the Entire Module imported
    TransferHttpModule, // Our Http TransferData method
    FlexLayoutModule,
    MaterialModule,
    DndModule.forRoot(),


    // App Routing
    RouterModule.forRoot([
        {
          path: "",
          redirectTo: "home",
          pathMatch: "full"
        },
        {
          path: "home",
          component: HomeComponent,

          data: {
            title: "Homepage"
          }
        },
      ],
      {
        // Router options
        useHash: false,
        preloadingStrategy: PreloadAllModules,
        initialNavigation: "enabled"
      })
  ],
  providers: [
    // ConnectionResolver,
  ],
  entryComponents: [
    CofirmDeleteDialogComponent
  ]
})
export class AppModuleShared {}
