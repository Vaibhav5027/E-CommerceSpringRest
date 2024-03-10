package com.infy.ecommerce.serviceImpl;

import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infy.ecommerce.dao.CustomerRepo;
import com.infy.ecommerce.dto.Purchase;
import com.infy.ecommerce.dto.PurchaseResponse;
import com.infy.ecommerce.entity.Address;
import com.infy.ecommerce.entity.Customer;
import com.infy.ecommerce.entity.Order;
import com.infy.ecommerce.entity.OrderItem;
import com.infy.ecommerce.service.CheckoutService;

import jakarta.transaction.Transactional;

@Service
public class CheckoutServiceImpl implements CheckoutService {
   
	@Autowired
	CustomerRepo customerRepo;
	
	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {
		Order order = purchase.getOrder();
		String orderTrackingNumber=generateUniqTrackingNumber();
		order.setOrderTrackingNumber(orderTrackingNumber);
		
		Address billingAddress = purchase.getBillingAddress();
		Address shippingAddress = purchase.getShippingAddress();
		Set<OrderItem> items = purchase.getOrderItems();
		items.forEach(data->order.add(data));
		Customer customer = purchase.getCustomer();
		customer.addOrder(order);
		
		customerRepo.save(customer);
	
		return new PurchaseResponse(orderTrackingNumber);
	}

	private String generateUniqTrackingNumber() {
		// TODO Auto-generated method stub
		return UUID.randomUUID().toString();
	}

}
