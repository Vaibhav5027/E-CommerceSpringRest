import { Injectable } from "@angular/core";
import { CartItem } from "../common/cart-item";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CartService {
  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  constructor() {}
  addToCart(theCartItem: CartItem) {
    let existedCartItem: boolean = false;
    let presentCartItem: CartItem | undefined;
    presentCartItem = undefined;
    // for (let tempCartItem of this.cartItems) {
    //   if (tempCartItem.id === theCartItem.id) {
    //     presentCartItem = tempCartItem;
    //     existedCartItem = true;
    //     break;
    //   }
    // }
    presentCartItem = this.cartItems.find(
      (items) => items.id == theCartItem.id
    );
    if (presentCartItem != undefined) {
      presentCartItem.quantity++;
    } else {
      if (!presentCartItem) {
        presentCartItem = theCartItem;
      }
      this.cartItems.push(presentCartItem);
    }
    this.computeCartTotal();
  }
  computeCartTotal() {
    let totalPriceValue = 0;
    let totalQuantityValue = 0;

    for (let tempProduct of this.cartItems) {
      totalPriceValue += tempProduct.quantity * tempProduct.unitPrice;
      totalQuantityValue += tempProduct.quantity;
    }

    this.totalPrice.next(+totalPriceValue.toFixed(2));
    this.totalQuantity.next(totalQuantityValue);
    // this.logCartData(totalPriceValue, totalQuantityValue);
  }
  // logCartData(totalPriceValue: number, totalQuantityValue: number) {
  //   console.log("content of the cart");

  //   for (let tempCartProduct of this.cartItems) {
  //     let totalSubPrice = tempCartProduct.quantity * tempCartProduct.unitPrice;

  //     console.log(
  //       `name:${tempCartProduct.name}, unitPrice:${tempCartProduct.unitPrice},totalSubPrice:${totalSubPrice}`
  //     );
  //     console.log(
  //       `totalPrice:${totalPriceValue.toFixed(
  //         2
  //       )} ,totalQuantityValue:${totalQuantityValue}`
  //     );
  //     console.log("------------");
  //   }
  // }
  decrementQuantity(cartItem: CartItem) {
    cartItem.quantity--;

    if (cartItem.quantity === 0) {
      this.remove(cartItem);
    } else {
      this.computeCartTotal();
    }
  }

  remove(cartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex((obj) => cartItem.id === obj.id);

    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotal();
    }
  }
}
