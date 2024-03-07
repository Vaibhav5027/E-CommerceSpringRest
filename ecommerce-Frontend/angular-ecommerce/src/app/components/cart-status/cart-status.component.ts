import { Component, OnInit } from "@angular/core";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-cart-status",
  templateUrl: "./cart-status.component.html",
  styleUrls: ["./cart-status.component.css"],
})
export class CartStatusComponent implements OnInit {
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  ngOnInit(): void {
    this.updateCartStatus();
  }
  constructor(private cartservice: CartService) {}
  updateCartStatus() {
    this.cartservice.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
    this.cartservice.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });
  }
}
