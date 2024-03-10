package com.infy.ecommerce.service;

import com.infy.ecommerce.dto.Purchase;
import com.infy.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {
PurchaseResponse placeOrder(Purchase purchase);
}
