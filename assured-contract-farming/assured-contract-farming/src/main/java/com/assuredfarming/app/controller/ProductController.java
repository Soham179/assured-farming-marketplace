package com.assuredfarming.app.controller;

import com.assuredfarming.app.model.Product;
import com.assuredfarming.app.model.User;
import com.assuredfarming.app.service.ProductService;
import com.assuredfarming.app.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    // GET all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // GET product by ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        return product == null
                ? ResponseEntity.notFound().build()
                : ResponseEntity.ok(product);
    }

    // ✅ FIXED: CREATE product (uses farmer EMAIL)
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {

        if (product.getFarmer() == null || product.getFarmer().getEmail() == null) {
            return ResponseEntity.badRequest().body(null);
        }

        User farmer = userService.getUserByEmail(product.getFarmer().getEmail())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        product.setFarmer(farmer);

        if (product.getQuantity() == null) product.setQuantity(0.0);
        if (product.getPrice() == null) product.setPrice(0.0);

        return ResponseEntity.ok(productService.createProduct(product));
    }

    // UPDATE product
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Integer id,
            @RequestBody Product productDetails) {

        Product existingProduct = productService.getProductById(id);
        if (existingProduct == null) {
            return ResponseEntity.notFound().build();
        }

        if (productDetails.getName() != null)
            existingProduct.setName(productDetails.getName());
        if (productDetails.getDescription() != null)
            existingProduct.setDescription(productDetails.getDescription());
        if (productDetails.getCategory() != null)
            existingProduct.setCategory(productDetails.getCategory());
        if (productDetails.getQuantity() != null)
            existingProduct.setQuantity(productDetails.getQuantity());
        if (productDetails.getPrice() != null)
            existingProduct.setPrice(productDetails.getPrice());

        return ResponseEntity.ok(productService.updateProduct(existingProduct));
    }

    // DELETE product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        Product product = productService.getProductById(id);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

    // GET products by farmer email
    @GetMapping("/farmer/{email}")
    public ResponseEntity<List<Product>> getProductsByFarmer(@PathVariable String email) {

        User farmer = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        return ResponseEntity.ok(productService.getProductsByFarmer(farmer));
    }
}
