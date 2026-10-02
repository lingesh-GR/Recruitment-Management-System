package com.example.Recuriment.user.dto;

import com.example.Recuriment.user.entity.Role;
import lombok.Data;

@Data
public class LoginResponse {
    private  String token;
    private  Long id;
    private  String name;
    private  String emailid;
    private Role role;
}
