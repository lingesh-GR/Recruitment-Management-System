package com.example.Recuriment.job.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @Column(nullable = false)
    private  String title;
    @Column(nullable = false,columnDefinition = "Text")
    private  String description;
    @Column(nullable = false)
    private  String location;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private  EmploymentType employmentType;
    @Column(nullable = false)
    private  String experienceRequired;
    private BigDecimal maxSalary;
    private  BigDecimal minSalary;
    @Column(columnDefinition = "Text")
    private  String skillRequired;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus jobStatus;
    private LocalDateTime createdAt;
    private  LocalDateTime updatedAt;
    @PrePersist
    protected  void onCreate()
    {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if(jobStatus == null)
            jobStatus = JobStatus.DRAFT;
    }
    @PreUpdate
    protected  void onUpdate()
    {
        updatedAt = LocalDateTime.now();
    }
}
