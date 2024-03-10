import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { CustomValidators } from "src/app/common/CustomValidators";
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
  checkOutFormGroup: FormGroup = new FormGroup({});
  totalQuantity: number = 0;
  totalPrice: number = 0;
  submitted: boolean = false;
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
    this.cartService.totalPrice.subscribe((data) => {
      this.totalPrice = data;
    });
    this.cartService.totalQuantity.subscribe((data) => {
      this.totalQuantity = data;
    });

    this.checkOutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        lastName: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        email: new FormControl("", [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\[a-z]{2,4}$"),
        ]),
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        city: new FormControl("", [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhiteSpace,
        ]),
        state: new FormControl("", [Validators.required]),
        country: new FormControl("", [Validators.required]),
        zipCode: new FormControl("", [
          Validators.required,
          Validators.minLength(6),
          CustomValidators.notOnlyWhiteSpace,
        ]),
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
        cardNumber: new FormControl("", [
          Validators.required,
          Validators.pattern("[0-9]{16}"),
        ]),
        securityCode: new FormControl("", [
          Validators.required,
          Validators.pattern("[0-9]{3}"),
        ]),
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
    this.submitted = true; // Set the submitted flag to true when form is submitted

    // Check if the form is valid before proceeding
    if (this.checkOutFormGroup.invalid) {
      return;
    }

    // Form submission logic
    console.log("Form submitted successfully!");
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
  get firstName() {
    return this.checkOutFormGroup.get("customer.firstName");
  }
  get lastName() {
    return this.checkOutFormGroup.get("customer.lastName");
  }
  get email() {
    return this.checkOutFormGroup.get("customer.email");
  }
  get shippingAddressStreet() {
    return this.checkOutFormGroup.get("shippingAddress.street");
  }
  get shippingAddressCity() {
    return this.checkOutFormGroup.get("shippingAddress.city");
  }
  get shippingAddressState() {
    return this.checkOutFormGroup.get("shippingAddress.state");
  }
  get shippingAddressZipcode() {
    return this.checkOutFormGroup.get("shippingAddress.zipCode");
  }
  get shippingAddressCountry() {
    return this.checkOutFormGroup.get("shippingAddress.country");
  }
  get creaditCardNum() {
    return this.checkOutFormGroup.get("creditCard.cardNumber");
  }
  get creaditCardSecurityCode() {
    return this.checkOutFormGroup.get("creditCard.securityCode");
  }

  checkForErrors(controlName: string): boolean {
    const control = this.checkOutFormGroup.get(`customer.${controlName}`);
    return this.submitted && !!control && control.invalid;
  }
  checkErrorForShipping(controlName: string): boolean {
    const control = this.checkOutFormGroup.get(
      `shippingAddress.${controlName}`
    );
    return this.submitted && !!control && control.invalid;
  }

  checkForErrorsForCreditCard(controlName: string): boolean {
    const control = this.checkOutFormGroup.get(`creditCard.${controlName}`);
    return this.submitted && !!control && control.invalid;
  }
  purchase() {
    this.onSubmit();
  }
}
