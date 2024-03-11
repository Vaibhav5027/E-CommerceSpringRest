import { Component, Inject, OnInit } from "@angular/core";
import { OKTA_AUTH } from "@okta/okta-angular";
import { OktaAuth } from "@okta/okta-auth-js";
import myAppConfig from "src/app/config/my-app-config";
import OktaSignIn from "@okta/okta-signin-widget";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  oktaSignIn: any;
  constructor(@Inject(OKTA_AUTH) oktaAuth: OktaAuth) {
    this.oktaSignIn = new OktaSignIn({
      logo: "assets/images/logo.png",
      baseUrl: myAppConfig.oidc.issuer.split("/outh2")[0],
      clienId: myAppConfig.oidc.clientId,
      redirectUrl: myAppConfig.oidc.redirectUri,
      authParams: {
        pkce: true,
        issuer: myAppConfig.oidc.issuer,
        scopes: myAppConfig.oidc.scopes,
      },
    });
  }
  ngOnInit(): void {
    this.oktaSignIn.remove();
    this.oktaSignIn.renderEl(
      {
        el: "#okta-sign-in-widget",
      },
      (response: any) => {
        if (response.status == "SUCCESS") {
          this.oktaSignIn.signInWithRedirect();
        }
      },
      (error: any) => {
        throw error;
      }
    );
  }
}
