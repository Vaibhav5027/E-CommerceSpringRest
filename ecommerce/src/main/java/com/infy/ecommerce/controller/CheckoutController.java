package com.infy.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infy.ecommerce.dto.Purchase;
import com.infy.ecommerce.dto.PurchaseResponse;
import com.infy.ecommerce.service.CheckoutService;

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
	

}
