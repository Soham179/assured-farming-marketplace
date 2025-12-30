//package com.assuredfarming.app.controller;
//
//import com.assuredfarming.app.entity.Farmer;
//import com.assuredfarming.app.service.FarmerService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Optional;
//
//@RestController
//@RequestMapping("/farmers")
//public class FarmerController {
//
//    @Autowired
//    private FarmerService farmerService;
//
//    @GetMapping
//    public List<Farmer> getAllFarmers() {
//        return farmerService.getAllFarmers();
//    }
//
//    @GetMapping("/{id}")
//    public Optional<Farmer> getFarmerById(@PathVariable Long id) {
//        return farmerService.getFarmerById(id);
//    }
//
//    @PostMapping
//    public Farmer createFarmer(@RequestBody Farmer farmer) {
//        return farmerService.saveFarmer(farmer);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteFarmer(@PathVariable Long id) {
//        farmerService.deleteFarmer(id);
//    }
//}
