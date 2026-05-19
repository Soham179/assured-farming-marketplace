package com.assuredfarming.app.dto;
import jakarta.validation.constraints.*;
        import lombok.Data;

@Data
public class LoginRequest {
    @Email private String email;
    @NotBlank private String password;
}
