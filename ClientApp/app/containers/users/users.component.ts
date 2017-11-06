import {
  Component, OnInit,
  // animation imports
  trigger, state, style, transition, animate, Inject
} from "@angular/core";
import { IUser } from "../../models/User";
import { UserService } from "../../shared/user.service";

@Component({
  selector: "users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.css"],
  animations: [
    // Animation example
    // Triggered in the ngFor with [@flyInOut]
    trigger("flyInOut",
      [
        state("in", style({ transform: "translateY(0)" })),
        transition("void => *",
          [
            style({ transform: "translateY(-100%)" }),
            animate(1000)
          ]),
        transition("* => void",
          [
            animate(1000, style({ transform: "translateY(100%)" }))
          ])
      ])
  ]
})
export class UsersComponent implements OnInit {

  public users: IUser[];
  public selectedUser: IUser;

  // Use "constructor"s only for dependency injection
  constructor(private userService: UserService) {}

  // Here you want to handle anything with @Input()'s @Output()'s
  // Data retrieval / etc - this is when the Component is "ready" and wired up
  public ngOnInit() {
    this.userService.getUsers().subscribe(result => {
      console.log("Get user result: ", result);
      console.log("TransferHttp [GET] /api/users/allresult", result);
      this.users = result as IUser[];
    });
  }

  public onSelect(user: IUser): void {
    this.selectedUser = user;
  }

  public deleteUser(user: IUser) {
    this.userService.deleteUser(user).subscribe(result => {
        console.log("Delete user result: ", result);
        if (result.ok) {
          let position = this.users.indexOf(user);
          this.users.splice(position, 1);
        }
      },
      error => {
        console.log(`There was an issue. ${error._body}.`);
      });
  }

  public addUser(newUserName: string) {
    this.userService.addUser(newUserName).subscribe(result => {
        console.log("Post user result: ", result);
        if (result.ok) {
          this.users.push(result.json());
        }
      },
      error => {
        console.log(`There was an issue. ${error._body}.`);
      });
  }
}
