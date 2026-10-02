package com.example.Recuriment.application.entity;

import com.example.Recuriment.job.entity.Job;
import com.example.Recuriment.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
@Table(name = "applications")
public class Application {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    @ManyToOne
    @JoinColumn(name = "candidate_id",nullable = false)
    private User candidate;
    @ManyToOne
    @JoinColumn(name = "job_id",nullable = false)
    private Job job;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private  ApplicationStatus applicationStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    @PrePersist
    protected  void onCreate()
    {
        createdAt = LocalDateTime.now();
        updateAt = LocalDateTime.now();
        applicationStatus = ApplicationStatus.APPLIED;
    }
    @PreUpdate
    protected  void onUpdate()
    {
        updateAt = LocalDateTime.now();
    }
}
