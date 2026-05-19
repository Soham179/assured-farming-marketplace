package com.assuredfarming.app.service;

import com.assuredfarming.app.model.Payment;
import com.assuredfarming.app.model.PaymentStatus;
import com.assuredfarming.app.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    @Override
    public Payment createPayment(Payment payment) {
        payment.setStatus(PaymentStatus.PENDING);
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
    public List<Payment> getPaymentsByContractId(Integer contractId) {
        return paymentRepository.findByContract_ContractId(contractId);
    }

    // 🔥 CREATE ORDER
    @Override
    public String createRazorpayOrder(Integer paymentId) {
        try {
            Payment payment = getPaymentById(paymentId);

            if (payment == null) {
                throw new RuntimeException("Payment not found");
            }

            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            JSONObject options = new JSONObject();
            options.put("amount", payment.getAmount() * 100); // in paise
            options.put("currency", "INR");
            options.put("receipt", "payment_" + paymentId);

            Order order = client.Orders.create(options);

            // Save Razorpay Order ID
            payment.setRazorpayOrderId(order.get("id"));
            paymentRepository.save(payment);

            return order.toString();

        } catch (Exception e) {
            throw new RuntimeException("Error creating Razorpay order: " + e.getMessage());
        }
    }

    // 🔥 VERIFY PAYMENT (FIXED)
    @Override
    public Payment verifyPayment(String orderId, String paymentId, String signature) {

        Payment payment = paymentRepository.findAll()
                .stream()
                .filter(p -> orderId.equals(p.getRazorpayOrderId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        try {
            boolean isValid = Utils.verifySignature(
                    orderId + "|" + paymentId,
                    signature,
                    keySecret
            );

            if (isValid) {
                payment.setStatus(PaymentStatus.COMPLETED);
                payment.setRazorpayPaymentId(paymentId);
                payment.setRazorpaySignature(signature);
                payment.setPaymentDate(new Date());
            } else {
                payment.setStatus(PaymentStatus.FAILED);
            }

        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
        }

        return paymentRepository.save(payment);
    }
}