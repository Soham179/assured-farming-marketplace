package com.assuredfarming.app.service;

import com.assuredfarming.app.dto.ContractRequestDTO;
import com.assuredfarming.app.model.Contract;
import java.util.List;

public interface ContractService {

    // Existing methods...
    Contract createContract(Contract contract);
    Contract createContractFromDTO(ContractRequestDTO contractRequest);
    Contract createContractByEmail(ContractRequestDTO.ByEmailDTO contractRequest);
    List<Contract> getAllContracts();
    Contract getContractById(Integer id);
    Contract activateContract(Integer id);
    Contract completeContract(Integer id);
    Contract cancelContract(Integer id);
    List<Contract> getContractsByFarmer(String email);
    List<Contract> getContractsByBuyer(String email);

    // ✅ ADD THESE METHODS:
    void fixExistingContractCrops();  // Add this line
    void deleteContract(Integer id);   // Add this line
}