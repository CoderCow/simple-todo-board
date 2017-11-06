import { Component } from "@angular/core";

@Component({
  selector: "nav-menu",
  templateUrl: "./navmenu.component.html",
  styleUrls: ["./navmenu.component.css"]
})
export class NavMenuComponent {
  public collapse = "collapse";

  public collapseNavbar(): void {
    if (this.collapse.length > 1) {
      this.collapse = "";
    } else {
      this.collapse = "collapse";
    }
  }

  public collapseMenu() {
    this.collapse = "collapse";
  }
}
