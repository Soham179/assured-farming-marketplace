package com.assuredfarming.app.repository;

import com.assuredfarming.app.model.Payment;
import com.assuredfarming.app.model.PaymentStatus; // ADD THIS IMPORT
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // Method 1: Find payments by contract ID using query method
    List<Payment> findByContract_ContractId(Integer contractId);

    // OR Method 2: Using custom query (alternative)
    @Query("SELECT p FROM Payment p WHERE p.contract.contractId = :contractId")
    List<Payment> findPaymentsByContractId(@Param("contractId") Integer contractId);

    // Additional methods you might need
    List<Payment> findByStatus(PaymentStatus status);
}