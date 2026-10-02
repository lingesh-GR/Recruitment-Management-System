package com.example.Recuriment.user.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ResetPasswordRequest {
    @NotBlank(message = "Token is Required")
    private String token;
    @Size(max = 20 ,message = "The password should be less than or equal to 20")
    private String password;
}
