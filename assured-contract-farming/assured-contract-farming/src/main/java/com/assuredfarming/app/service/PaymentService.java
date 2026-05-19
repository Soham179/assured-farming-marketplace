package com.assuredfarming.app.service;

import com.assuredfarming.app.model.Payment;
import java.util.List;

public interface PaymentService {

    Payment createPayment(Payment payment);
    List<Payment> getAllPayments();
    Payment getPaymentById(Integer id);
    Payment updatePayment(Payment payment);
    void deletePayment(Integer id);

    List<Payment> getPaymentsByContractId(Integer contractId);

    // 🔥 NEW METHODS
    String createRazorpayOrder(Integer paymentId);
    Payment verifyPayment(String orderId, String paymentId, String signature);
}