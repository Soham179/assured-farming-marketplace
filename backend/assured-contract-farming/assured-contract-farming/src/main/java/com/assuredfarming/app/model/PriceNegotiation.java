package com.assuredfarming.app.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "price_negotiations")
@Getter
@Setter
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class PriceNegotiation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer negotiationId;

    // 🔗 Product being negotiated
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnoreProperties({"farmer"}) // prevent deep nesting
    private Product product;

    // 👤 Buyer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    // 👨‍🌾 Farmer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id", nullable = false)
    private User farmer;

    // 💰 Latest prices
    @Column(nullable = false)
    private Double buyerPrice;

    private Double farmerPrice;

    // 🟡 PENDING / ACCEPTED / REJECTED
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NegotiationStatus status;

    // 🔄 BUYER / FARMER
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UpdatedBy lastUpdatedBy;

    // 🕒 Timestamps
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.status = NegotiationStatus.PENDING;
        this.lastUpdatedBy = UpdatedBy.BUYER;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
