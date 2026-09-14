package com.example.Recuriment.candidate.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class CandidateResponse {

    private Long id;

    private Long userId;

    private String name;
    private String email;
    private String phone;

    private LocalDate dateOfBirth;
    private String gender;
    private String location;

    private String highestQualification;
    private String university;
    private Integer graduationYear;

    private String skills;
    private Integer experienceYears;
    private String currentCompany;

    private String resumeUrl;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;

    private String bio;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
