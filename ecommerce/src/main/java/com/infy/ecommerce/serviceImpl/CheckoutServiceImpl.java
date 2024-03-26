package com.infy.ecommerce.serviceImpl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.infy.ecommerce.dao.CustomerRepo;
import com.infy.ecommerce.dto.PaymentInfo;
import com.infy.ecommerce.dto.Purchase;
import com.infy.ecommerce.dto.PurchaseResponse;
import com.infy.ecommerce.entity.Address;
import com.infy.ecommerce.entity.Customer;
import com.infy.ecommerce.entity.Order;
import com.infy.ecommerce.entity.OrderItem;
import com.infy.ecommerce.service.CheckoutService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import jakarta.transaction.Transactional;

@Service
public class CheckoutServiceImpl implements CheckoutService {
   

	CustomerRepo customerRepo;
	
	
	private String stripeKey;
	
	
	
	public CheckoutServiceImpl(CustomerRepo customerRepo, @Value("${stripe.key.secret}") String stripeKey) {
		super();
		this.customerRepo = customerRepo;
		Stripe.apiKey= stripeKey;
	}

	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {
		Order order = purchase.getOrder();
		String orderTrackingNumber=generateUniqTrackingNumber();
		order.setOrderTrackingNumber(orderTrackingNumber);
		
		   order.setBillingAddress(purchase.getBillingAddress());
	        order.setShippingAddress(purchase.getShippingAddress());
		Set<OrderItem> items = purchase.getOrderItems();
		items.forEach(data->order.add(data));
		Customer customer = purchase.getCustomer();
		
		String email=customer.getEmail();
		Customer customerDB = customerRepo.findByEmail(email);
		if(customerDB!=null) {
			customer=customerDB;
		}
		customer.addOrder(order);
		customerRepo.save(customer);
		return new PurchaseResponse(orderTrackingNumber);
	}

	private String generateUniqTrackingNumber() {
		// TODO Auto-generated method stub
		return UUID.randomUUID().toString();
	}

	@Override
	public PaymentIntent createPayment(PaymentInfo paymentInfo) throws StripeException {
	 List<String> paymentMethods=new ArrayList<>();
	 paymentMethods.add("card");
	 Map<String,Object> params=new HashMap<>();
	 params.put("amount", paymentInfo.getAmount());
	 params.put("currency", paymentInfo.getCurrency());
	 params.put("payment_methos_types",paymentMethods );
		return PaymentIntent.create(params);
	}

}
