package com.infy.ecommerce.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.infy.ecommerce.entity.Product;
@CrossOrigin("http://localhost:4200/")
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
}
