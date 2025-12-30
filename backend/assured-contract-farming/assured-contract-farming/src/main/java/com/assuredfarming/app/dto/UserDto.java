package com.assuredfarming.app.dto;
import com.assuredfarming.app.model.UserRole;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserDto {
    private String name;
    @Email private String email;
    @NotBlank private String password;
    private UserRole role;
    private String phone;
    private String address;
    private String status = "ACTIVE"; // default value

}
