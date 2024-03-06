package com.infy.ecommerce.entity;

import java.math.BigDecimal;
import java.sql.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;


@Entity
@Table(name="products")
@Data
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    @JsonProperty
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonProperty
    private ProductCategory category;

    @Column(name = "sku")
    @JsonProperty
    private String sku;

    @Column(name = "name")
    @JsonProperty
    private String name;

    @Column(name = "description")
    @JsonProperty
    private String description;

    @Column(name = "unit_price")
    @JsonProperty
    private BigDecimal unitPrice;

    @Column(name = "image_url")
    @JsonProperty
    private String imageUrl;

    @Column(name = "active")
    @JsonProperty
    private boolean active;

    @Column(name = "units_in_stock")
    @JsonProperty
    private int unitsInStock;

    @Column(name = "date_created")
    @JsonProperty
    @CreationTimestamp
    private Date dateCreated;

    @Column(name = "last_updated")
    @UpdateTimestamp
    @JsonProperty
    private Date lastUpdated;
}
