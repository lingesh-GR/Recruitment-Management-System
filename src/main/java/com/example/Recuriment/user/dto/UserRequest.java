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
    @Size(max = 20 , message = "The password should less than or equal to 10")
    private  String password;
    @NotBlank(message = "The phone is required")
    @Pattern(regexp = "^[0-9]{10}$",message = "The Phone should contains 10 Size")
    private  String phone;
}

