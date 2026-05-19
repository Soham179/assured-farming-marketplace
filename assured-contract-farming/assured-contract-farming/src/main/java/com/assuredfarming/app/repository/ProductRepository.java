package com.assuredfarming.app.repository;

import com.assuredfarming.app.model.Product;
import com.assuredfarming.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Method 1: Find products by farmer object
    List<Product> findByFarmer(User farmer);

    // Method 2: Find products by farmer email
    @Query("SELECT p FROM Product p WHERE p.farmer.email = :email")
    List<Product> findByFarmerEmail(@Param("email") String email);
}