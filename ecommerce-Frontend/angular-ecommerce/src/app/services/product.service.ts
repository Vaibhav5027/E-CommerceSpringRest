import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Product } from "../common/product";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ProductCategory } from "../common/product-category";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category";

  constructor(private httpClient: HttpClient) {}

  getProductList(theCategoryId: number): Observable<Product[]> {
    // need to build URL based on category id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.httpClient
      .get<GetResponse>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }
  searchProduct(value: any): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${value}`;

    return this.httpClient
      .get<GetResponse>(searchUrl)
      .pipe(map((response) => response._embedded.products));
  }
  getCategoryList(): Observable<ProductCategory[]> {
    return this.httpClient
      .get<GetCategoryResponse>(this.categoryUrl)
      .pipe(map((response) => response._embedded.productCategory));
  }

  getProduct(categoryId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${categoryId}`;
    return this.httpClient.get<Product>(productUrl);
  }
}

interface GetResponse {
  _embedded: {
    products: Product[];
  };
}
interface GetCategoryResponse {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
