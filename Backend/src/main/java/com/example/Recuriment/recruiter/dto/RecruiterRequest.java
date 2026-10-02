package com.example.Recuriment.recruiter.dto;

import com.example.Recuriment.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecruiterRequest {
    @NotBlank(message = "The field should not be Empty")
    private String designation;
    @NotBlank(message = "The field should not be Empty")
    private String companyName;
}
