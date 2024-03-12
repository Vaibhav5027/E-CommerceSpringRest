import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-loginstatus",
  templateUrl: "./loginstatus.component.html",
  styleUrls: ["./loginstatus.component.css"],
})
export class LoginstatusComponent implements OnInit {
  isAuthenticated: boolean = false;
  login() {
    this.isAuthenticated = true;
  }
  logout() {
    this.isAuthenticated = false;
  }
  userFullName: any;
  ngOnInit(): void {}
}
