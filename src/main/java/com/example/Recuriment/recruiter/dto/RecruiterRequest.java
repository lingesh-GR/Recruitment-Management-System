package com.example.Recuriment.recruiter.dto;

import com.example.Recuriment.user.entity.User;
import lombok.Data;

@Data
public class RecruiterRequest {
    private Long userId;
    private String designation;
    private String companyName;
}
