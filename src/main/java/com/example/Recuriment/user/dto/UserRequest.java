package com.example.Recuriment.user.dto;

import com.example.Recuriment.user.entity.AccountStatus;
import com.example.Recuriment.user.entity.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UserRequest {
    @NotBlank(message = "The name is required")
    private  String name;
    @NotBlank(message = "The password is required")
    @Size(max = 10 , message = "The password should less than or equal to 10")
    private  String password;
    @NotBlank(message = "The email is Required")
    @Email(message = "The email should be valid")
    private String emailid;
    @NotBlank(message = "The phone is required")
    @Pattern(regexp = "^[0-9]{10}$",message = "The Phone should contains 10 Size")
    private  String phone;
    @NotNull(message =
            "The Role should be Required")
    private Role role;
    @NotNull(message = "The Account Status should be Required")
    private AccountStatus accountStatus;
}

