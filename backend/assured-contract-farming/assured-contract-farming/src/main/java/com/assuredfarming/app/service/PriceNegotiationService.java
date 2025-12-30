package com.assuredfarming.app.service;

import com.assuredfarming.app.model.*;
import com.assuredfarming.app.repository.PriceNegotiationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PriceNegotiationService {

    private final PriceNegotiationRepository repository;

    public PriceNegotiationService(PriceNegotiationRepository repository) {
        this.repository = repository;
    }

    // ================= CREATE NEGOTIATION (BUYER) =================
    public PriceNegotiation createNegotiation(
            Product product,
            User buyer,
            User farmer,
            Double buyerPrice
    ) {
        PriceNegotiation negotiation = new PriceNegotiation();
        negotiation.setProduct(product);
        negotiation.setBuyer(buyer);
        negotiation.setFarmer(farmer);
        negotiation.setBuyerPrice(buyerPrice);
        negotiation.setFarmerPrice(product.getPrice());
        negotiation.setStatus(NegotiationStatus.PENDING);
        negotiation.setLastUpdatedBy(UpdatedBy.BUYER);

        return repository.save(negotiation);
    }

    // ================= FARMER COUNTER =================
    public PriceNegotiation counterByFarmer(Integer negotiationId, Double farmerPrice) {
        PriceNegotiation negotiation = repository.findById(negotiationId)
                .orElseThrow(() -> new RuntimeException("Negotiation not found"));

        negotiation.setFarmerPrice(farmerPrice);
        negotiation.setStatus(NegotiationStatus.PENDING);
        negotiation.setLastUpdatedBy(UpdatedBy.FARMER);

        return repository.save(negotiation);
    }

    // ================= ACCEPT =================
    public PriceNegotiation acceptNegotiation(Integer negotiationId) {
        PriceNegotiation negotiation = repository.findById(negotiationId)
                .orElseThrow(() -> new RuntimeException("Negotiation not found"));

        negotiation.setStatus(NegotiationStatus.ACCEPTED);
        negotiation.setLastUpdatedBy(UpdatedBy.FARMER);

        return repository.save(negotiation);
    }

    // ================= REJECT =================
    public PriceNegotiation rejectNegotiation(Integer negotiationId) {
        PriceNegotiation negotiation = repository.findById(negotiationId)
                .orElseThrow(() -> new RuntimeException("Negotiation not found"));

        negotiation.setStatus(NegotiationStatus.REJECTED);
        negotiation.setLastUpdatedBy(UpdatedBy.FARMER);

        return repository.save(negotiation);
    }

    // ================= FARMER VIEW =================
    public List<PriceNegotiation> getNegotiationsForFarmer(User farmer) {
        return repository.findByFarmer(farmer);
    }

    // ================= BUYER VIEW =================
    public List<PriceNegotiation> getNegotiationsForBuyer(User buyer) {
        return repository.findByBuyer(buyer);
    }
}
