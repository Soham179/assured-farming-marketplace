package com.assuredfarming.app.service;

import com.assuredfarming.app.model.Product;
import com.assuredfarming.app.model.User;
import java.util.List;

public interface ProductService {
    Product createProduct(Product product);
    List<Product> getAllProducts();
    Product getProductById(Integer id);
    Product updateProduct(Product product);
    void deleteProduct(Integer id);
    List<Product> getProductsByFarmer(User farmer);
    List<Product> getProductsByFarmerEmail(String email);
}