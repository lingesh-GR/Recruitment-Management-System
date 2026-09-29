package com.example.Recuriment.application.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApplicationRequest {
    @NotNull(message = "JobId should be Required")
    private  Long jobId;
}
