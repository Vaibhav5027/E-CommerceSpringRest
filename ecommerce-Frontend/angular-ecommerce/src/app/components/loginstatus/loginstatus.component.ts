import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: "app-loginstatus",
  templateUrl: "./loginstatus.component.html",
  styleUrls: ["./loginstatus.component.css"],
})
export class LoginstatusComponent implements OnInit {
  checkOutFormGroup: FormGroup = new FormGroup({});

  constructor(
    private formBuilder: FormBuilder,

    private router: Router
  ) {}

  logout() {}
  userFullName: any;
  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      user: this.formBuilder.group({
        firstName: "",
        lastName: "",
      }),
    });
  }

  onSubmit() {}
}
