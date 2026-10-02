package com.example.Recuriment.candidate.entity;

import com.example.Recuriment.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "candidates")
public class Candidate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id",nullable = false,unique = true)
    private User user;
    private LocalDate dateOfBirth;
    private  String gender;
    private  String location;
    private  String highestQualification;
    private String university;
    private  Integer graduationYear;
    @Column(columnDefinition = "TEXT")
    private  String skills;
    private  Integer experienceYears;
    private  String currentCompany;
    private String resumeUrl;
    private  String linkedinUrl;
    private  String githubUrl;
    private  String portfolioUrl;
    @Column(columnDefinition = "TEXT")
    private String bio;
    private LocalDateTime createdAt;
    private  LocalDateTime updatedAt;
    @PrePersist
    protected  void  onCreate()
    {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected  void  onUpdate()
    {
        updatedAt = LocalDateTime.now();
    }
}
