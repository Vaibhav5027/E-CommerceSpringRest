package com.infy.ecommerce.dto;

import java.util.Set;

import com.infy.ecommerce.entity.Address;
import com.infy.ecommerce.entity.Customer;
import com.infy.ecommerce.entity.Order;
import com.infy.ecommerce.entity.OrderItem;

import lombok.Data;

@Data
public class Purchase {

	private Customer customer;
	private Order order;
	private Address shippingAddress;
	
	private Address billingAddress;
	private Set<OrderItem> orderItems;
}
