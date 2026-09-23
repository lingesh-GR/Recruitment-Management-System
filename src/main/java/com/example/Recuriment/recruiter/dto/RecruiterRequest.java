package com.example.Recuriment.recruiter.dto;

import com.example.Recuriment.user.entity.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RecruiterRequest {
    @NotNull(message = "The Field should not be Null")
    private Long userId;
    @NotBlank(message = "The field should not be Empty")
    private String designation;
    @NotBlank(message = "The field should not be Empty")
    private String companyName;
}
