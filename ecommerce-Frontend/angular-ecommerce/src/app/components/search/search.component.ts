import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: "app-search",
  templateUrl: "./search.component.html",
  styleUrls: ["./search.component.css"],
})
export class SearchComponent implements OnInit {
  ngOnInit(): void {}
  constructor(private router: Router, private productService: ProductService) {}

  doSearch(input: string) {
    console.log(`value=${input}`);
    this.router.navigateByUrl(`/search/${input}`);
  }
}
