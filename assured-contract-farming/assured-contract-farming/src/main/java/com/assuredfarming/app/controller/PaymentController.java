package com.assuredfarming.app.controller;

import com.assuredfarming.app.model.Payment;
import com.assuredfarming.app.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    // CREATE PAYMENT
    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.createPayment(payment));
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer id) {
        return ResponseEntity.ok(paymentService.getPaymentById(id));
    }

    // 🔥 CREATE ORDER
    @PostMapping("/create-order/{paymentId}")
    public ResponseEntity<String> createOrder(@PathVariable Integer paymentId) {
        return ResponseEntity.ok(paymentService.createRazorpayOrder(paymentId));
    }

    // 🔥 VERIFY PAYMENT
    @PostMapping("/verify")
    public ResponseEntity<Payment> verifyPayment(
            @RequestParam String orderId,
            @RequestParam String paymentId,
            @RequestParam String signature) {

        return ResponseEntity.ok(
                paymentService.verifyPayment(orderId, paymentId, signature)
        );
    }

    // GET BY CONTRACT
    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<Payment>> getPaymentsByContractId(@PathVariable Integer contractId) {
        return ResponseEntity.ok(paymentService.getPaymentsByContractId(contractId));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}