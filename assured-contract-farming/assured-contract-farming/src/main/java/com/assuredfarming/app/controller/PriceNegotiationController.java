package com.assuredfarming.app.controller;

import com.assuredfarming.app.model.PriceNegotiation;
import com.assuredfarming.app.model.Product;
import com.assuredfarming.app.model.User;
import com.assuredfarming.app.service.PriceNegotiationService;
import com.assuredfarming.app.service.ProductService;
import com.assuredfarming.app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/negotiations")
@CrossOrigin(origins = "*")
public class PriceNegotiationController {

    private final PriceNegotiationService negotiationService;
    private final ProductService productService;
    private final UserService userService;

    public PriceNegotiationController(
            PriceNegotiationService negotiationService,
            ProductService productService,
            UserService userService
    ) {
        this.negotiationService = negotiationService;
        this.productService = productService;
        this.userService = userService;
    }

    // ================= BUYER SEND OFFER =================
    @PostMapping("/create")
    public ResponseEntity<?> createNegotiation(
            @RequestParam Integer productId,
            @RequestParam Integer buyerId,
            @RequestParam Double buyerPrice
    ) {
        Product product = productService.getProductById(productId);
        if (product == null) {
            return ResponseEntity.badRequest().body("Product not found");
        }

        User buyer = userService.getUserById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        User farmer = product.getFarmer();

        return ResponseEntity.ok(
                negotiationService.createNegotiation(product, buyer, farmer, buyerPrice)
        );
    }

    // ================= FARMER COUNTER =================
    @PutMapping("/counter/{id}")
    public ResponseEntity<?> counter(
            @PathVariable Integer id,
            @RequestParam Double farmerPrice
    ) {
        return ResponseEntity.ok(
                negotiationService.counterByFarmer(id, farmerPrice)
        );
    }

    // ================= ACCEPT =================
    @PutMapping("/accept/{id}")
    public ResponseEntity<?> accept(@PathVariable Integer id) {
        return ResponseEntity.ok(
                negotiationService.acceptNegotiation(id)
        );
    }

    // ================= REJECT =================
    @PutMapping("/reject/{id}")
    public ResponseEntity<?> reject(@PathVariable Integer id) {
        return ResponseEntity.ok(
                negotiationService.rejectNegotiation(id)
        );
    }

    // ================= FARMER VIEW =================
    @GetMapping("/farmer/{email}")
    public ResponseEntity<List<PriceNegotiation>> farmerNegotiations(
            @PathVariable String email
    ) {
        User farmer = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        return ResponseEntity.ok(
                negotiationService.getNegotiationsForFarmer(farmer)
        );
    }

    // ================= BUYER VIEW =================
    @GetMapping("/buyer/{email}")
    public ResponseEntity<List<PriceNegotiation>> buyerNegotiations(
            @PathVariable String email
    ) {
        User buyer = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));

        return ResponseEntity.ok(
                negotiationService.getNegotiationsForBuyer(buyer)
        );
    }
}
