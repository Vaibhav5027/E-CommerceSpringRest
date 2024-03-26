package com.infy.ecommerce.service;

import com.infy.ecommerce.dto.PaymentInfo;
import com.infy.ecommerce.dto.Purchase;
import com.infy.ecommerce.dto.PurchaseResponse;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

public interface CheckoutService {
PurchaseResponse placeOrder(Purchase purchase);

PaymentIntent createPayment(PaymentInfo paymentInfo) throws StripeException;
}
