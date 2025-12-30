package com.assuredfarming.app.service;

import com.assuredfarming.app.model.Payment;
import com.assuredfarming.app.model.PaymentStatus;
import com.assuredfarming.app.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Override
    public Payment createPayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    @Override
    public Payment getPaymentById(Integer id) {
        return paymentRepository.findById(id).orElse(null);
    }

    @Override
    public Payment updatePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    @Override
    public void deletePayment(Integer id) {
        paymentRepository.deleteById(id);
    }

    @Override
    public Payment completePayment(Integer id) {
        Payment payment = getPaymentById(id);
        if (payment != null) {
            payment.setStatus(PaymentStatus.COMPLETED);
            paymentRepository.save(payment);
        }
        return payment;
    }

    @Override
    public Payment cancelPayment(Integer id) {
        Payment payment = getPaymentById(id);
        if (payment != null) {
            payment.setStatus(PaymentStatus.CANCELLED);
            paymentRepository.save(payment);
        }
        return payment;
    }

    @Override
    public List<Payment> getPaymentsByContractId(Integer contractId) {
        // Use the repository method
        return paymentRepository.findByContract_ContractId(contractId);
    }
}