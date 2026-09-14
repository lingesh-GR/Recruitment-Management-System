package com.example.Recuriment.job.dto;

import com.example.Recuriment.job.entity.EmploymentType;
import com.example.Recuriment.job.entity.JobStatus;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class JobRequest {
    private String title;
    private String description;
    private String location;
    private EmploymentType employmentType;
    private String experienceRequired;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String skillsRequired;
    private JobStatus jobStatus;
}
