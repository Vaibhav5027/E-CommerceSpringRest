import { Component, OnInit } from "@angular/core";
import { ProductService } from "src/app/services/product.service";
import { Product } from "src/app/common/product";
import { ActivatedRoute } from "@angular/router";
import { CartItem } from "src/app/common/cart-item";
import { CartService } from "src/app/services/cart.service";

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list-grid.component.html",
  styleUrls: ["./product-list.component.css"],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;
  previousCategoryId: number = 1;
  priviousString: string = " ";
  keyWord = "";
  //properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has("keyword");
    if (this.searchMode) {
      this.keyWord = this.route.snapshot.paramMap.get("keyword")!;
      if (this.priviousString != this.keyWord) {
        this.pageNumber = 1;
      }
      this.priviousString = this.keyWord;
      this.productService
        .searchProductWithPaginate(
          this.keyWord,
          this.pageNumber - 1,
          this.pageSize
        )
        .subscribe(this.processData());
    } else {
      this.listProductsById();
    }
  }

  listProductsById() {
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");

    if (hasCategoryId) {
      this.currentCategoryId = +this.route.snapshot.paramMap.get("id")!;
      this.currentCategoryName = this.route.snapshot.paramMap.get("name")!;
    } else {
      this.currentCategoryId = 1;
    }
    if (this.previousCategoryId != this.currentCategoryId) {
      this.pageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    this.productService
      .getProductListByPagination(
        this.currentCategoryId,
        this.pageNumber - 1,
        this.pageSize
      )
      .subscribe(this.processData());
  }

  updatePageSize(pageSize: string) {
    this.pageSize = +pageSize;
    this.pageNumber = 1;
    this.listProducts();
  }
  processData() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.pageNumber = data.page.number + 1;
      this.pageSize = data.page.size;
      this.totalElements = data.page.totalElements;
    };
  }
  addToCart(obj: Product) {
    const cartObj = new CartItem(obj);
    this.cartService.addToCart(cartObj);
  }
}
