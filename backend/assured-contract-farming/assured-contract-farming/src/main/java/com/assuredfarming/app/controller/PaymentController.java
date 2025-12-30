package com.assuredfarming.app.controller;

import com.assuredfarming.app.model.Payment;
import com.assuredfarming.app.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody Payment payment) {
        return ResponseEntity.ok(paymentService.createPayment(payment));
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Integer id) {
        Payment payment = paymentService.getPaymentById(id);
        return ResponseEntity.ok(payment);
    }

    @PutMapping("/complete/{id}")
    public ResponseEntity<Payment> completePayment(@PathVariable Integer id) {
        Payment payment = paymentService.completePayment(id);
        return ResponseEntity.ok(payment);
    }

    @PutMapping("/cancel/{id}")
    public ResponseEntity<Payment> cancelPayment(@PathVariable Integer id) {
        Payment payment = paymentService.cancelPayment(id);
        return ResponseEntity.ok(payment);
    }

    @GetMapping("/contract/{contractId}")
    public ResponseEntity<List<Payment>> getPaymentsByContractId(@PathVariable Integer contractId) {
        return ResponseEntity.ok(paymentService.getPaymentsByContractId(contractId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Integer id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
