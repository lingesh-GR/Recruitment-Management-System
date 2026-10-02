package com.example.Recuriment.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "It should not be blank")
    @Email(message = "The EmailId should be Valid")
    private String emailid;
    @NotBlank(message = "It should not be blank")
    @Size(max = 20,message = "The Password should be less than or equal to 10")
    private  String password;

}
