package com.example.Recuriment.candidate.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDate;

@Data
public class CandidateRequest {
    @NotNull(message = "The Value should not be null")
    @Past(message = "Data Should be in the Past")
    private LocalDate dateOfBirth;
    @NotBlank(message = "The field should not be Bank")
    private String gender;
    @NotBlank(message = "The field should not be bank")
    private String location;
    @NotBlank(message = "The field should not be Bank")
    private String highestQualification;
    @NotBlank(message = "The field should not be Bank")
    private String university;
    @NotNull(message = "The Year should not be null")
    @Min(value = 1950 ,message = "The value should not be Negative")
    private Integer graduationYear;
    @NotBlank(message = "The field should not be lank")
    private String skills;
    @NotNull(message = "The field should not be null")
    @PositiveOrZero(message =  "The field not be Negative")
    private Integer experienceYears;
    private String currentCompany;
    @NotBlank(message = "The field should not be lank")
    @URL(message = "The URL is not valid")
    private String resumeUrl;
    @NotBlank(message = "The field should not be lank")
    @URL(message = "The URL is not valid")
    private String linkedinUrl;
    @NotBlank(message = "The field should not be lank")
    @URL(message = "The URL is not valid")
    private String githubUrl;
    @URL(message = "The URL is not valid")
    private String portfolioUrl;
    @NotBlank(message = "The field should not be lank")
    private String bio;
}
