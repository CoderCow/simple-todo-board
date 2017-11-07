import { NgModule, Inject } from "@angular/core";
import { RouterModule, PreloadAllModules } from "@angular/router";
import { CommonModule, APP_BASE_HREF } from "@angular/common";
import { HttpModule, Http } from "@angular/http";
import { FormsModule } from "@angular/forms";

import { Ng2BootstrapModule } from "ngx-bootstrap";

// i18n support
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

import { AppComponent } from "./app.component";
import { NavMenuComponent } from "./components/navmenu/navmenu.component";
import { HomeComponent } from "./containers/home/home.component";
import { UsersComponent } from "./containers/users/users.component";
import { UserDetailComponent } from "./components/user-detail/user-detail.component";
import { CounterComponent } from "./containers/counter/counter.component";
// import { ChatComponent } from './containers/chat/chat.component';
import { NotFoundComponent } from "./containers/not-found/not-found.component";
import { NgxBootstrapComponent } from "./containers/ngx-bootstrap-demo/ngx-bootstrap.component";

import { UserService } from "./shared/user.service";
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
import {DndModule} from 'ng2-dnd';

export function createTranslateLoader(http: Http, baseHref) {
  // Temporary Azure hack
  if (baseHref === null && typeof window !== "undefined") {
    baseHref = window.location.origin;
  }
  // i18n files are in `wwwroot/assets/`
  return new TranslateHttpLoader(http, `${baseHref}/assets/i18n/`, ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    CounterComponent,
    UsersComponent,
    UserDetailComponent,
    HomeComponent,
    // ChatComponent,
    NotFoundComponent,
    NgxBootstrapComponent,
    TodoGroupComponent,
    TodoItemComponent,
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

    // i18n support
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http, [ORIGIN_URL]]
      }
    }),

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
        {
          path: "counter",
          component: CounterComponent,

          data: {
            title: "Counter"
          }
        },
        {
          path: "users",
          component: UsersComponent,

          data: {
            title: "Users REST example"
          }
        },
        {
          path: "ngx-bootstrap",
          component: NgxBootstrapComponent,

          data: {
            title: "Ngx-bootstrap demo!!"
          }
        },
        { path: "lazy", loadChildren: "./containers/lazy/lazy.module#LazyModule" },
        {
          path: "**",

          component: NotFoundComponent,
          data: {
            title: "404 - Not found"
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
  providers: [
    UserService,
    // ConnectionResolver,
    TranslateModule
  ]
})
export class AppModuleShared {}
