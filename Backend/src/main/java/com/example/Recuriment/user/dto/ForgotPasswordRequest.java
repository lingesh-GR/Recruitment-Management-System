package com.example.Recuriment.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordRequest {
    @Email(message = "Given the Valid Email")
    @NotBlank(message = "The message Should not be Blank")
    private String emailid;
}
