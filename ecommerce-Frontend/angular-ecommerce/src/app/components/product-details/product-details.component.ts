import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Product } from "src/app/common/product";
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
    private productService: ProductService
  ) {}
  ngOnInit(): void {
    this.getProductDetals();
  }
  getProductDetals() {
    this.categoryId = +this.route.snapshot.paramMap.get("id")!;
    this.productService
      .getProduct(this.categoryId)
      .subscribe((data: Product) => {
        this.product = data;
      });
  }
}
