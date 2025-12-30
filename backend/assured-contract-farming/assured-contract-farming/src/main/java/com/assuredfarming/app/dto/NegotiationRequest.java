package com.assuredfarming.app.dto;

public class NegotiationRequest {

    private Integer productId;
    private String buyerEmail;
    private Double buyerPrice;
    private String message;

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getBuyerEmail() {
        return buyerEmail;
    }

    public void setBuyerEmail(String buyerEmail) {
        this.buyerEmail = buyerEmail;
    }

    public Double getBuyerPrice() {
        return buyerPrice;
    }

    public void setBuyerPrice(Double buyerPrice) {
        this.buyerPrice = buyerPrice;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
