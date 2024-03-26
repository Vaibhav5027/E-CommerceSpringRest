import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { CustomValidators } from "src/app/common/CustomValidators";
import { Country } from "src/app/common/country";
import { Order } from "src/app/common/order";
import { OrderItem } from "src/app/common/order-item";
import { PaymentInfo } from "src/app/common/payment-info";
import { Purchase } from "src/app/common/purchase";
import { State } from "src/app/common/state";
import { CartService } from "src/app/services/cart.service";
import { CheckoutService } from "src/app/services/checkout.service";
import { FormsServices } from "src/app/services/formservices";
import { environment } from "src/environments/environment";

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

  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any = "";
  constructor(
    private formBuilder: FormBuilder,
    private cartService: CartService,
    private formService: FormsServices,
    private checkoutSerivce: CheckoutService,
    private router: Router
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
        /*
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
         **/
      }),
    });
    /*
    let month = new Date().getMonth() + 1;
    this.formService.getExpireMonth(month).subscribe((data) => {
      this.creditCardMonth = data;
      console.log("Month:" + JSON.stringify(data));
    });

    this.formService.getExpireYear().subscribe((data) => {
      this.creditCardYear = data;
      console.log("Year:" + JSON.stringify(data));
    });
 **/
    this.formService
      .getCountries()
      .subscribe((data) => (this.countries = data));

    //setUp stripe Form
    this.setupStripePaymentForm();
  }
  setupStripePaymentForm() {
    //get handler to stripe element

    var element = this.stripe.elements();
    // create card element
    this.cardElement = element.create("card", { hidePostalCode: true });
    // add instance of card ui component into 'card-element' div
    this.cardElement.mount("#card-element");
    //add event binding for 'change event'
    this.cardElement.on("change", (event: any) => {
      this.displayError = document.getElementById("card-errors");

      if (event.complete) {
        this.displayError.textContent = "";
      } else if (event.error) {
        this.displayError.textContent = event.error.message;
      }
    });
  }
  onSubmit() {
    this.submitted = true;
    if (this.checkOutFormGroup.invalid) {
      this.checkOutFormGroup.markAllAsTouched;
      return;
    }
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = [];
    // for (let i = 0; i < cartItems.length; i++) {
    //   orderItems[i] = new OrderItem(cartItems[i]);
    // }
    // another way is
    let orderItems1: OrderItem[] = cartItems.map(
      (tempItem) => new OrderItem(tempItem)
    );

    //setup purchase
    let purchase = new Purchase();
    purchase.customer = this.checkOutFormGroup.controls["customer"].value;

    purchase.shippingAddress =
      this.checkOutFormGroup.controls["shippingAddress"].value;
    const shippingState: State = JSON.parse(
      JSON.stringify(purchase.shippingAddress.state)
    );
    const shippingContry: Country = JSON.parse(
      JSON.stringify(purchase.shippingAddress.country)
    );
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingContry.name;

    purchase.billingAddress =
      this.checkOutFormGroup.controls["billingAddress"].value;
    const billingState: State = JSON.parse(
      JSON.stringify(purchase.billingAddress.state)
    );
    const billingContry: Country = JSON.parse(
      JSON.stringify(purchase.billingAddress.country)
    );
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingContry.name;

    purchase.order = order;
    purchase.orderItems = orderItems1;
    this.paymentInfo.amount = this.totalPrice * 100;
    this.paymentInfo.currency = "USD";

    if (
      !this.checkOutFormGroup.invalid &&
      this.displayError.textContent === ""
    ) {
      this.checkoutSerivce
        .createPaymentIntent(this.paymentInfo)
        .subscribe((response) => {
          this.stripe
            .confirmCardPayment(
              response.client_secret,
              {
                payment_method: {
                  card: this.cardElement,
                },
              },
              { handleAction: false }
            )
            .then((result: any) => {
              if (result.error) {
                alert(`there was an error:${result.error.message}`);
              } else {
                this.checkoutSerivce.placeOrder(purchase).subscribe({
                  next: (response) => {
                    alert(
                      `your order has been recieved: ${response.orderTrackingNumber}`
                    );
                    this.resetCart();
                  },
                  error: (err) => {
                    alert(`something wrong:${err.message}`);
                  },
                });
              }
            });
        });
    } else {
      this.checkOutFormGroup.markAllAsTouched;
      return;
    }
  }
  resetCart() {
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.checkOutFormGroup.reset();
    this.router.navigateByUrl("/products");
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
