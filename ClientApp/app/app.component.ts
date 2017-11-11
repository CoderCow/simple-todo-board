import { Component, OnInit, OnDestroy, Inject, ViewEncapsulation, RendererFactory2, PLATFORM_ID } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute, PRIMARY_OUTLET } from "@angular/router";
import { Title, DOCUMENT, MetaDefinition } from "@angular/platform-browser";
import { Subscription } from "rxjs/Subscription";
import { isPlatformServer } from "@angular/common";

import { REQUEST } from "./core/constants/request";

@Component({
  selector: "app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  private defaultPageTitle = "My Todo Board";
  private endPageTitle = this.defaultPageTitle;

  private routerSub$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    @Inject(REQUEST) private request
  ) {}

  public ngOnInit() {
    // Change "Title" on every navigationEnd event
    // Titles come from the data.title property on all Routes (see app.routes.ts)
    this.registerNavigationSubscriber();
  }

  public ngOnDestroy() {
    this.routerSub$.unsubscribe();
  }

  private registerNavigationSubscriber() {
    this.routerSub$ = this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild)
          route = route.firstChild;

        return route;
      })
      .filter(route => route.outlet === "primary")
      .mergeMap(route => route.data)
      .subscribe(this.refreshPageHeader.bind(this));
  }

  /* Sets some meta information of the <head> in respect to the route. */
  private refreshPageHeader(routeData: any) {
    // Set Title if available, otherwise leave the default Title
    const title = routeData.title
      ? `${routeData.title} - ${this.endPageTitle}`
      : `${this.defaultPageTitle} - ${this.endPageTitle}`;

    this.title.setTitle(title);
  }
}
