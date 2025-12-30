package com.assuredfarming.app.repository;

import com.assuredfarming.app.model.PriceNegotiation;
import com.assuredfarming.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceNegotiationRepository
        extends JpaRepository<PriceNegotiation, Integer> {

    // 🔹 Farmer dashboard
    List<PriceNegotiation> findByFarmer(User farmer);

    // 🔹 Buyer dashboard
    List<PriceNegotiation> findByBuyer(User buyer);
}
