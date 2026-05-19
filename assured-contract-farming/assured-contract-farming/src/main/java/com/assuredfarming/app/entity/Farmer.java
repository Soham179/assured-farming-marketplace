//package com.assuredfarming.app.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "farmers")
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Farmer {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false)
//    private String name;
//
//    @Column(unique = true, nullable = false)
//    private String email;
//
//    @Column(nullable = false)
//    private String phone;
//
//    @Column
//    private String address;
//
//    @Column
//    private String bankAccount;
//
//    @Column
//    private String ifscCode;
//}
