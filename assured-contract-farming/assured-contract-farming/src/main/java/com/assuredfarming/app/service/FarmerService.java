//package com.assuredfarming.app.service;
//
//import com.assuredfarming.app.entity.Farmer;
//import com.assuredfarming.app.repository.FarmerRepository;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//public class FarmerService {
//
//    @Autowired
//    private FarmerRepository farmerRepository;
//
//    public List<Farmer> getAllFarmers() {
//        return farmerRepository.findAll();
//    }
//
//    public Optional<Farmer> getFarmerById(Long id) {
//        return farmerRepository.findById(id);
//    }
//
//    public Farmer saveFarmer(Farmer farmer) {
//        return farmerRepository.save(farmer);
//    }
//
//    public void deleteFarmer(Long id) {
//        farmerRepository.deleteById(id);
//    }
//}
