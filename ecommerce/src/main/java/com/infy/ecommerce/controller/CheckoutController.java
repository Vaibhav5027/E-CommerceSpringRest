package com.infy.ecommerce.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.infy.ecommerce.JWT.AuthenticateRequest;
import com.infy.ecommerce.JWT.AuthenticateResponse;
import com.infy.ecommerce.JWT.JwtUtil;
import com.infy.ecommerce.dto.Purchase;
import com.infy.ecommerce.dto.PurchaseResponse;
import com.infy.ecommerce.service.CheckoutService;

@RestController
@RequestMapping("api/checkout")
@CrossOrigin("http://localhost:4200/")
public class CheckoutController {
	@Autowired
	CheckoutService service;
	
	@Autowired
	AuthenticationManager authenticationManger;
	@Autowired
	UserDetailsService userDetailsService;
	@Autowired
	JwtUtil jwtUtil;

	@PostMapping("/purchase")
	public PurchaseResponse purchase(@RequestBody Purchase purchase ) {
		PurchaseResponse order = service.placeOrder(purchase);
		System.out.println(order);
		return order;
	}
	
	@PostMapping("/authenticate")
	ResponseEntity<?> aunthicateUser(@RequestBody AuthenticateRequest request) throws Exception{
		try {
			authenticationManger.authenticate(new UsernamePasswordAuthenticationToken(request.getName(), request.getPassword()));
	
		}
		catch(BadCredentialsException e) {
			throw new Exception("User Not Found");
		}
		final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getName());
		String token = jwtUtil.generateToken(userDetails);
		
		return ResponseEntity.ok(new AuthenticateResponse(token));
	}
}
