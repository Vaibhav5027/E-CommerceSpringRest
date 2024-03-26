package com.infy.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infy.ecommerce.dto.PaymentInfo;
import com.infy.ecommerce.dto.Purchase;
import com.infy.ecommerce.dto.PurchaseResponse;
import com.infy.ecommerce.service.CheckoutService;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

@RestController
@RequestMapping("api/checkout")
@CrossOrigin("http://localhost:4200/")
public class CheckoutController {
	@Autowired
	CheckoutService service;


	@PostMapping("/purchase")
	public PurchaseResponse purchase(@RequestBody Purchase purchase ) {
		PurchaseResponse order = service.placeOrder(purchase);
		System.out.println(order);
		return order;
	}
	
	@PostMapping("/payment-intent")
	ResponseEntity<String> createPaymentIntent(@RequestBody PaymentInfo info) throws StripeException{
		
		PaymentIntent payment = service.createPayment(info);
		String json = payment.toJson();
		return new ResponseEntity<String>(json,HttpStatus.OK);
	}

}
