package com.assuredfarming.app.service;

import com.assuredfarming.app.model.Payment;
import java.util.List;

public interface PaymentService {
    Payment createPayment(Payment payment);
    List<Payment> getAllPayments();
    Payment getPaymentById(Integer id);
    Payment updatePayment(Payment payment);
    void deletePayment(Integer id);
    Payment completePayment(Integer id);
    Payment cancelPayment(Integer id);
    List<Payment> getPaymentsByContractId(Integer contractId);
}