package com.infy.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.infy.ecommerce.entity.Customer;

public interface CustomerRepo extends JpaRepository<Customer, Long> {

}
