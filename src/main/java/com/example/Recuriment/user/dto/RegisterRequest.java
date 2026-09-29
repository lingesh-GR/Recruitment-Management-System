package com.example.Recuriment.user.dto;

import com.example.Recuriment.user.entity.Role;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "The name is required")
    private String name;

    @NotBlank(message = "The password is required")
    @Size(max = 20, message = "The password should be less than or equal to 20")
    private String password;

    @NotBlank(message = "The email is required")
    @Email(message = "The email should be valid")
    private String emailid;

    @NotBlank(message = "The phone is required")
    @Pattern(
            regexp = "^[0-9]{10}$",
            message = "The phone should contain 10 digits"
    )
    private String phone;

    @NotNull(message = "The role is required")
    private Role role;
}