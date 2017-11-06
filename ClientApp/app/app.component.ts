import { Component, OnInit, OnDestroy, Inject, ViewEncapsulation, RendererFactory2, PLATFORM_ID } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute, PRIMARY_OUTLET } from "@angular/router";
import { Meta, Title, DOCUMENT, MetaDefinition } from "@angular/platform-browser";
import { Subscription } from "rxjs/Subscription";
import { isPlatformServer } from "@angular/common";

// i18n support
import { TranslateService } from "@ngx-translate/core";
import { REQUEST } from "./shared/constants/request";

@Component({
  selector: "app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit, OnDestroy {
  // This will go at the END of your title for example "Home - Angular Universal..." <-- after the dash (-)
  private endPageTitle = "Angular Universal and ASP.NET Core Starter";
  // If no Title is provided, we'll use a default one before the dash(-)
  private defaultPageTitle = "My App";

  private routerSub$: Subscription;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    public translate: TranslateService,
    @Inject(REQUEST) private request
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang("en");

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use("en");

    console.log(`What's our REQUEST Object look like?`);
    console.log(`The Request object only really exists on the Server, but on the Browser we can at least see Cookies`);
    console.log(this.request);
  }

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

    const metaData = routeData.meta || [];

    for (let i = 0; i < metaData.length; i++)
      this.meta.updateTag(metaData[i]);
  }
}
