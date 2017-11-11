import { NgModule, Optional, SkipSelf } from "@angular/core";
import { throwIfAlreadyLoaded } from "./module-import-guard";
import { CommonModule } from "@angular/common";
import { HttpModule } from "@angular/http";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";

// import { ConnectionResolver } from './shared/route.resolver';
import { ORIGIN_URL } from "../core/constants/baseurl.constants";
import { TransferHttpModule } from "../../modules/transfer-http/transfer-http.module";

// https://github.com/angular/flex-layout/wiki/Fast-Starts
import { FlexLayoutModule } from "@angular/flex-layout";

// material design
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

import { NavMenuComponent } from "./navmenu/navmenu.component";
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';

import { TodoItemService } from './services/todo-item.service';
import { TodoGroupService } from './services/todo-group.service';

@NgModule({
  declarations: [
    NavMenuComponent,
    Autosize,
    LoadingSpinnerComponent
  ],
  imports: [
    CommonModule,

    HttpModule,
    HttpClientModule,
    FormsModule,
    TransferHttpModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  exports: [
    NavMenuComponent,
    Autosize,
    LoadingSpinnerComponent,

    CommonModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    TransferHttpModule,
    FlexLayoutModule,
    MaterialModule,
  ],
  providers: [
    TodoGroupService,
    TodoItemService
  ]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
