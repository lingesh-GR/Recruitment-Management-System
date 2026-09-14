package com.example.Recuriment.application.dto;

import com.example.Recuriment.application.entity.ApplicationStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ApplicationResponse {
    private  Long id;
    private  Long candidateId;
    private  Long jobId;
    private ApplicationStatus applicationStatus;
    private LocalDateTime updateAt;
    private  LocalDateTime createdAt;
}
