package com.assuredfarming.app.repository;

import com.assuredfarming.app.model.Contract;
import com.assuredfarming.app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Integer> {

    // Find contracts by farmer
    List<Contract> findByFarmer(User farmer);

    // Find contracts by buyer
    List<Contract> findByBuyer(User buyer);

    // Find contracts by product
    List<Contract> findByProduct_ProductId(Integer productId);

    // Query methods for email search
    @Query("SELECT c FROM Contract c WHERE c.farmer.email = :email")
    List<Contract> findByFarmerEmail(@Param("email") String email);

    @Query("SELECT c FROM Contract c WHERE c.buyer.email = :email")
    List<Contract> findByBuyerEmail(@Param("email") String email);

    // Find by status
    List<Contract> findByStatus(String status);
}