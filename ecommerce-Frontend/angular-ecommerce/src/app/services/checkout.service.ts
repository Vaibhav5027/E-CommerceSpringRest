import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Purchase } from "../common/purchase";
import { Observable } from "rxjs";
import { PaymentInfo } from "../common/payment-info";

@Injectable({
  providedIn: "root",
})
export class CheckoutService {
  purchaseUrl = "http://localhost:8081/api/checkout/purchase";
  paymentIntentUrl = "http://localhost:8081/api/checkout/payment-intent";
  constructor(private httpClient: HttpClient) {}

  placeOrder(purchase: Purchase): Observable<any> {
    console.log(`purchse:` + JSON.stringify(purchase));
    return this.httpClient.post(this.purchaseUrl, purchase);
  }

  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any> {
    return this.httpClient.post<PaymentInfo>(
      this.paymentIntentUrl,
      paymentInfo
    );
  }
}
