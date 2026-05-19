package com.assuredfarming.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContractRequestDTO {
    private Integer productId;
    private Integer buyerId;
    private Integer farmerId;
    private Double quantity;
    private Double price;
    private Date startDate;
    private Date endDate;
    private String crop;

    // Optional: You can also add email-based DTO
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ByEmailDTO {
        private Integer productId;
        private String buyerEmail;
        private String farmerEmail;
        private Double quantity;
        private Double price;
        private Date startDate;
        private Date endDate;
        private String crop;
    }
}