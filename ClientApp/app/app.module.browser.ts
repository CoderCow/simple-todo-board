import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { APP_BASE_HREF } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { ORIGIN_URL } from "./core/constants/baseurl.constants";
import { AppModuleShared } from "./app.module";
import { AppComponent } from "./app.component";
import { REQUEST } from "./core/constants/request";
import { BrowserTransferStateModule } from "../modules/transfer-state/browser-transfer-state.module";

import { BrowserPrebootModule } from "preboot/browser";

export function getOriginUrl() {
  return window.location.origin;
}

export function getRequest() {
  // the Request object only lives on the server
  return { cookie: document.cookie };
}

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({
      appId: "my-todo-app" // make sure this matches with your Server NgModule
    }),
    BrowserPrebootModule.replayEvents(),
    BrowserAnimationsModule,
    BrowserTransferStateModule,

    // Our Common AppModule
    AppModuleShared
  ],
  providers: [
    {
      // We need this for our Http calls since they'll be using an ORIGIN_URL provided in main.server
      // (Also remember the Server requires Absolute URLs)
      provide: ORIGIN_URL,
      useFactory: (getOriginUrl)
    }, {
      // The server provides these in main.server
      provide: REQUEST,
      useFactory: (getRequest)
    }
  ]
})
export class AppModule {}
