package com.infy.ecommerce.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.infy.ecommerce.entity.Product;
@CrossOrigin("http://localhost:4200/")
@RepositoryRestResource
public interface ProductRepository extends JpaRepository<Product, Long> {
	
	Page<Product> findByCategoryId(@Param("id") int categoryId,Pageable peagble);
	
	 Page<Product>  findByNameContaining(@Param("name") String name, Pageable page);
}
