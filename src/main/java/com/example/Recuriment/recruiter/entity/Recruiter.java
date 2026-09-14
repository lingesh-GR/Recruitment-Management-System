package com.example.Recuriment.recruiter.entity;

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
@Table(name = "recruiters")
public class Recruiter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne
    @JoinColumn(name = "user_id",nullable = false)
    private User user;
    @Column(nullable = false)
    private String designation;
    @Column(nullable = false)
    private String companyName;
    private LocalDateTime createdAt;
    private  LocalDateTime updatedAt;
    @PrePersist
    protected  void  onCreate()
    {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    @PreUpdate
    protected  void onUpdate()
    {
        updatedAt = LocalDateTime.now();
    }
}
