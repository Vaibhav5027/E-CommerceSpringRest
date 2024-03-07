import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CartItem } from "src/app/common/cart-item";
import { Product } from "src/app/common/product";
import { CartService } from "src/app/services/cart.service";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: "app-product-details",
  templateUrl: "./product-details.component.html",
  styleUrls: ["./product-details.component.css"],
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;
  categoryId!: number;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) {}
  ngOnInit(): void {
    this.getProductDetals();
  }
  getProductDetals() {
    this.categoryId = +this.route.snapshot.paramMap.get("id")!;
    this.productService
      .getProduct(this.categoryId)
      .subscribe((data: Product) => {
        console.log(data);
        this.product = data;
      });
  }
  addToCart() {
    const cartObj = new CartItem(this.product);
    this.cartService.addToCart(cartObj);
  }
}
