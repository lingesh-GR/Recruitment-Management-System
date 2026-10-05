package com.example.Recuriment.recruiter.dto;

import lombok.Data;

import java.time.LocalDateTime;
@Data
public class RecruiterResponse {
    private Long id;
    private  Long userId;
    private String designation;
    private String companyName;
    private String websiteUrl;
    private String industry;
    private String companySize;
    private String location;
    private String logoUrl;
    private String aboutCompany;
    private String companyLinkedinUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
