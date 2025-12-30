package com.assuredfarming.app.controller;

import com.assuredfarming.app.dto.ContractRequestDTO;
import com.assuredfarming.app.model.Contract;
import com.assuredfarming.app.service.ContractService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contracts")
@CrossOrigin(origins = "*")
public class ContractController {

    @Autowired
    private ContractService contractService;

    // CREATE contract (original endpoint - keep for backward compatibility)
    @PostMapping
    public ResponseEntity<Contract> createContract(@RequestBody Contract contract) {
        try {
            return ResponseEntity.ok(contractService.createContract(contract));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // CREATE contract using IDs (recommended endpoint)
    @PostMapping("/create")
    public ResponseEntity<Contract> createContractByIds(@RequestBody ContractRequestDTO contractRequest) {
        try {
            Contract contract = contractService.createContractFromDTO(contractRequest);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    // CREATE contract using emails (alternative endpoint)
    @PostMapping("/create-by-email")
    public ResponseEntity<Contract> createContractByEmail(@RequestBody ContractRequestDTO.ByEmailDTO contractRequest) {
        try {
            Contract contract = contractService.createContractByEmail(contractRequest);
            return ResponseEntity.ok(contract);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
    }

    // GET all contracts
    @GetMapping
    public ResponseEntity<List<Contract>> getAllContracts() {
        return ResponseEntity.ok(contractService.getAllContracts());
    }

    // GET contract by ID
    @GetMapping("/{id}")
    public ResponseEntity<Contract> getContractById(@PathVariable Integer id) {
        Contract contract = contractService.getContractById(id);
        if (contract == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(contract);
    }

    // ACTIVATE contract
    @PutMapping("/activate/{id}")
    public ResponseEntity<Contract> activateContract(@PathVariable Integer id) {
        Contract contract = contractService.activateContract(id);
        if (contract == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(contract);
    }

    // COMPLETE contract
    @PutMapping("/complete/{id}")
    public ResponseEntity<Contract> completeContract(@PathVariable Integer id) {
        Contract contract = contractService.completeContract(id);
        if (contract == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(contract);
    }

    // CANCEL contract
    @PutMapping("/cancel/{id}")
    public ResponseEntity<Contract> cancelContract(@PathVariable Integer id) {
        Contract contract = contractService.cancelContract(id);
        if (contract == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(contract);
    }

    // GET contracts by farmer email
    @GetMapping("/farmer/{email}")
    public ResponseEntity<List<Contract>> getContractsByFarmer(@PathVariable String email) {
        return ResponseEntity.ok(contractService.getContractsByFarmer(email));
    }

    // GET contracts by buyer email
    @GetMapping("/buyer/{email}")
    public ResponseEntity<List<Contract>> getContractsByBuyer(@PathVariable String email) {
        return ResponseEntity.ok(contractService.getContractsByBuyer(email));
    }

    // DELETE contract
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContract(@PathVariable Integer id) {
        Contract contract = contractService.getContractById(id);
        if (contract == null) {
            return ResponseEntity.notFound().build();
        }
        contractService.cancelContract(id);
        return ResponseEntity.noContent().build();
    }

    // ========== NEW ENDPOINT: Fix existing contract crops ==========
    @PutMapping("/fix-crops")
    public ResponseEntity<String> fixContractCrops() {
        try {
            contractService.fixExistingContractCrops();
            return ResponseEntity.ok("Contract crops fixed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fixing crops: " + e.getMessage());
        }
    }
    // ========== END NEW ENDPOINT ==========
}