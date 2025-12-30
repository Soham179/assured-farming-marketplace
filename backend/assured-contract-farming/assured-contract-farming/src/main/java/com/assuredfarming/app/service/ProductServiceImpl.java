package com.assuredfarming.app.service;

import com.assuredfarming.app.model.Product;
import com.assuredfarming.app.model.User;
import com.assuredfarming.app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public Product getProductById(Integer id) {
        return productRepository.findById(id).orElse(null);
    }

    @Override
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    @Override
    public List<Product> getProductsByFarmer(User farmer) {
        return productRepository.findByFarmer(farmer);
    }

    @Override
    public List<Product> getProductsByFarmerEmail(String email) {
        return productRepository.findByFarmerEmail(email);
    }
}