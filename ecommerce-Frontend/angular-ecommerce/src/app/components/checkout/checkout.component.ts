import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Country } from "src/app/common/country";
import { State } from "src/app/common/state";
import { CartService } from "src/app/services/cart.service";
import { FormsServices } from "src/app/services/formservices";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
})
export class CheckoutComponent implements OnInit {
  checkOutFormGroup!: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  creditCardMonth: number[] = [];
  creditCardYear: number[] = [];
  countries: Country[] = [];
  stateForShippingAdrres: State[] = [];
  stateForBiilingAdrres: State[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private formService: FormsServices
  ) {}
  ngOnInit(): void {
    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [""],
        lastName: [""],
        email: [""],
      }),
      shippingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipCode: [""],
      }),
      billingAddress: this.formBuilder.group({
        street: [""],
        city: [""],
        state: [""],
        country: [""],
        zipCode: [""],
      }),
      creditCard: this.formBuilder.group({
        cardType: [""],
        nameOnCard: [""],
        cardNumber: [""],
        securityCode: [""],
        expirationMonth: [""],
        expirationYear: [""],
      }),
    });

    let month = new Date().getMonth() + 1;
    this.formService.getExpireMonth(month).subscribe((data) => {
      this.creditCardMonth = data;
      console.log("Month:" + JSON.stringify(data));
    });

    this.formService.getExpireYear().subscribe((data) => {
      this.creditCardYear = data;
      console.log("Year:" + JSON.stringify(data));
    });

    this.formService
      .getCountries()
      .subscribe((data) => (this.countries = data));
  }
  onSubmit() {
    console.log(this.checkOutFormGroup.get("customer")?.value);
  }
  monthAndYearHandler() {
    const checkOutFormGroup: any = this.checkOutFormGroup.get("creditCard");
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(checkOutFormGroup.value.expirationYear);
    let startMonth: number;
    if (selectedYear === currentYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }
    this.formService.getExpireMonth(startMonth).subscribe((data) => {
      this.creditCardMonth = data;
      console.log("Month:" + JSON.stringify(data));
    });
  }

  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkOutFormGroup.controls["billingAddress"].setValue(
        this.checkOutFormGroup.controls["shippingAddress"].value
      );
      this.stateForBiilingAdrres = this.stateForShippingAdrres;
    } else {
      this.checkOutFormGroup.controls["billingAddress"].reset();
      this.stateForBiilingAdrres = [];
    }
  }
  getStates(formGroupName: string) {
    const formGroup = this.checkOutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    console.log(`countrycode:${countryCode},countryName:${countryName}`);

    this.formService.getStates(countryCode).subscribe((data) => {
      if (formGroupName == "shippingAddress") {
        this.stateForShippingAdrres = data;
      } else {
        this.stateForBiilingAdrres = data;
      }
      formGroup?.get("state")?.setValue(data[0]);
    });
  }
}
