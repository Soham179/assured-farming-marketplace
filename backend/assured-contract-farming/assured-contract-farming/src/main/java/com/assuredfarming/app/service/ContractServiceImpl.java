package com.assuredfarming.app.service;

import com.assuredfarming.app.dto.ContractRequestDTO;
import com.assuredfarming.app.model.Contract;
import com.assuredfarming.app.model.ContractStatus;
import com.assuredfarming.app.model.Product;
import com.assuredfarming.app.model.User;
import com.assuredfarming.app.repository.ContractRepository;
import com.assuredfarming.app.repository.UserRepository;
import com.assuredfarming.app.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ContractServiceImpl implements ContractService {

    @Autowired
    private ContractRepository contractRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Contract createContract(Contract contract) {
        // Validate required entities exist
        validateContractEntities(contract);

        // Set default status if not set
        if (contract.getStatus() == null) {
            contract.setStatus(ContractStatus.PENDING);
        }

        return contractRepository.save(contract);
    }

    // New method to create contract from DTO
    @Override
    public Contract createContractFromDTO(ContractRequestDTO contractRequest) {
        Contract contract = new Contract();

        // Resolve and set product
        Product product = productRepository.findById(contractRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + contractRequest.getProductId()));
        contract.setProduct(product);

        // Resolve and set buyer
        User buyer = userRepository.findById(contractRequest.getBuyerId())
                .orElseThrow(() -> new RuntimeException("Buyer not found with ID: " + contractRequest.getBuyerId()));
        contract.setBuyer(buyer);

        // Resolve and set farmer
        User farmer = userRepository.findById(contractRequest.getFarmerId())
                .orElseThrow(() -> new RuntimeException("Farmer not found with ID: " + contractRequest.getFarmerId()));
        contract.setFarmer(farmer);

        // Set other fields
        contract.setQuantity(contractRequest.getQuantity());
        contract.setPrice(contractRequest.getPrice());
        contract.setStartDate(contractRequest.getStartDate());
        contract.setEndDate(contractRequest.getEndDate());

        // ✅✅✅ FIX: CORRECT CROP NAME LOGIC
        String crop = getCorrectCropName(contractRequest.getCrop(), product);
        contract.setCrop(crop);

        contract.setStatus(ContractStatus.PENDING);

        return contractRepository.save(contract);
    }

    // Alternative: Create contract using email addresses
    @Override
    public Contract createContractByEmail(ContractRequestDTO.ByEmailDTO contractRequest) {
        Contract contract = new Contract();

        // Resolve and set product
        Product product = productRepository.findById(contractRequest.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + contractRequest.getProductId()));
        contract.setProduct(product);

        // Resolve and set buyer by email
        User buyer = userRepository.findByEmail(contractRequest.getBuyerEmail())
                .orElseThrow(() -> new RuntimeException("Buyer not found with email: " + contractRequest.getBuyerEmail()));
        contract.setBuyer(buyer);

        // Resolve and set farmer by email
        User farmer = userRepository.findByEmail(contractRequest.getFarmerEmail())
                .orElseThrow(() -> new RuntimeException("Farmer not found with email: " + contractRequest.getFarmerEmail()));
        contract.setFarmer(farmer);

        // Set other fields
        contract.setQuantity(contractRequest.getQuantity());
        contract.setPrice(contractRequest.getPrice());
        contract.setStartDate(contractRequest.getStartDate());
        contract.setEndDate(contractRequest.getEndDate());

        // ✅✅✅ FIX: CORRECT CROP NAME LOGIC
        String crop = getCorrectCropName(contractRequest.getCrop(), product);
        contract.setCrop(crop);

        contract.setStatus(ContractStatus.PENDING);

        return contractRepository.save(contract);
    }

    // ✅✅✅ CORRECTED METHOD: Get specific crop name
    private String getCorrectCropName(String requestedCrop, Product product) {
        // 1. Use requested crop if provided and valid
        if (requestedCrop != null && !requestedCrop.trim().isEmpty() && !requestedCrop.equalsIgnoreCase("General")) {
            return requestedCrop.trim();
        }

        // 2. Use product name (e.g., "Tomato", "Wheat") - THIS IS THE FIX!
        if (product != null && product.getName() != null && !product.getName().trim().isEmpty()) {
            return product.getName().trim();
        }

        // 3. Fallback: Use product category
        if (product != null && product.getCategory() != null && !product.getCategory().trim().isEmpty()) {
            return product.getCategory().trim();
        }

        // 4. Final fallback
        return "Crop";
    }

    private void validateContractEntities(Contract contract) {
        if (contract.getProduct() == null || contract.getProduct().getProductId() == null) {
            throw new IllegalArgumentException("Product must be specified");
        }
        if (contract.getBuyer() == null || contract.getBuyer().getUserId() == null) {
            throw new IllegalArgumentException("Buyer must be specified");
        }
        if (contract.getFarmer() == null || contract.getFarmer().getUserId() == null) {
            throw new IllegalArgumentException("Farmer must be specified");
        }

        // Verify entities exist in database
        productRepository.findById(contract.getProduct().getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));
        userRepository.findById(contract.getBuyer().getUserId())
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        userRepository.findById(contract.getFarmer().getUserId())
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
    }

    @Override
    public List<Contract> getAllContracts() {
        return contractRepository.findAll();
    }

    @Override
    public Contract getContractById(Integer id) {
        return contractRepository.findById(id).orElse(null);
    }

    @Override
    public Contract activateContract(Integer id) {
        Contract contract = getContractById(id);
        if (contract != null) {
            contract.setStatus(ContractStatus.ACTIVE);
            contractRepository.save(contract);
        }
        return contract;
    }

    @Override
    public Contract completeContract(Integer id) {
        Contract contract = getContractById(id);
        if (contract != null) {
            contract.setStatus(ContractStatus.COMPLETED);
            contractRepository.save(contract);
        }
        return contract;
    }

    @Override
    public Contract cancelContract(Integer id) {
        Contract contract = getContractById(id);
        if (contract != null) {
            contract.setStatus(ContractStatus.CANCELLED);
            contractRepository.save(contract);
        }
        return contract;
    }

    @Override
    public List<Contract> getContractsByFarmer(String email) {
        try {
            User farmer = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Farmer not found with email: " + email));
            return contractRepository.findByFarmer(farmer);
        } catch (RuntimeException e) {
            // Fallback to query method if farmer not found
            return contractRepository.findByFarmerEmail(email);
        }
    }

    @Override
    public List<Contract> getContractsByBuyer(String email) {
        try {
            User buyer = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Buyer not found with email: " + email));
            return contractRepository.findByBuyer(buyer);
        } catch (RuntimeException e) {
            // Fallback to query method if buyer not found
            return contractRepository.findByBuyerEmail(email);
        }
    }

    // ✅ ADD THIS METHOD IF YOUR INTERFACE HAS IT
    @Override
    public void fixExistingContractCrops() {
        List<Contract> contracts = contractRepository.findAll();
        int fixedCount = 0;

        for (Contract contract : contracts) {
            if (contract.getCrop() == null ||
                    contract.getCrop().trim().isEmpty() ||
                    contract.getCrop().equalsIgnoreCase("General")) {

                Product product = contract.getProduct();
                String newCrop = getCorrectCropName(contract.getCrop(), product);

                if (!newCrop.equals(contract.getCrop())) {
                    contract.setCrop(newCrop);
                    contractRepository.save(contract);
                    fixedCount++;
                }
            }
        }
        System.out.println("✅ Fixed " + fixedCount + " contracts with 'General' crop");
    }

    // ✅ ADD THIS METHOD IF YOUR INTERFACE HAS IT
    @Override
    public void deleteContract(Integer id) {
        if (contractRepository.existsById(id)) {
            contractRepository.deleteById(id);
        } else {
            throw new RuntimeException("Contract not found with ID: " + id);
        }
    }
}