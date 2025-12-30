package com.assuredfarming.app.dto;

import com.assuredfarming.app.model.UserRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private Integer userId;
    private String name;
    private String email;
    private UserRole role; // Make sure this is UserRole
}