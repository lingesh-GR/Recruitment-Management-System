package com.example.Recuriment.candidate.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class CandidateRequest {

    private Long userId;

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
}
