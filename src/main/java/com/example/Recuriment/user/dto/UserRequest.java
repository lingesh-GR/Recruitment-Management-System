package com.example.Recuriment.user.dto;

import com.example.Recuriment.user.entity.AccountStatus;
import com.example.Recuriment.user.entity.Role;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;

@Data
public class UserRequest {
    private  String name;
    private  String password;
    private String emailid;
    private  String phone;
    private Role role;
    private AccountStatus accountStatus;
}

