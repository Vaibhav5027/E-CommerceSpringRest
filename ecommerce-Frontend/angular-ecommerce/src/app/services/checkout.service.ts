import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Purchase } from "../common/purchase";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CheckoutService {
  purchaseUrl = "http://localhost:8080/api/checkout/purchase";
  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    console.log(`purchse:` + JSON.stringify(purchase));
    return this.httpClient.post(this.purchaseUrl, purchase);
  }
}
