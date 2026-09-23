package com.example.Recuriment.job.dto;

import com.example.Recuriment.job.entity.EmploymentType;
import com.example.Recuriment.job.entity.JobStatus;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class JobRequest {
    @NotBlank(message = "The field should not be Empty Space")
    private String title;
    @NotBlank(message = "The field should not be Empty Space")
    private String description;
    @NotBlank(message = "The field should not be Empty Space")
    private String location;
    @NotNull(message = "The Employment Type is Required")
    private EmploymentType employmentType;
    @NotBlank(message = "The field should not be Empty Space")
    private String experienceRequired;
    @NotNull(message = "The field not be null")
    @DecimalMin(value = "0.0",inclusive = false,
    message = "The value Should be greater than 0")
    private BigDecimal minSalary;
    @NotNull(message = "The field not be null")
    @DecimalMin(value = "0.0",inclusive = false,
            message = "The value Should be greater than 0")
    private BigDecimal maxSalary;
    @NotBlank(message = "The value should be fill")
    private String skillsRequired;
    @NotNull(message = "The field not be null")
    private JobStatus jobStatus;
}
