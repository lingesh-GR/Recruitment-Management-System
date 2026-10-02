package com.example.Recuriment.job.dto;

import com.example.Recuriment.job.entity.EmploymentType;
import com.example.Recuriment.job.entity.JobStatus;
import com.example.Recuriment.recruiter.entity.Recruiter;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private String location;
    private EmploymentType employmentType;
    private String experienceRequired;
    private BigDecimal minSalary;
    private BigDecimal maxSalary;
    private String skillRequired;
    private JobStatus jobStatus;
    private Recruiter recruiter;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
