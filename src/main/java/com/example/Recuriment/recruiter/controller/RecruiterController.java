package com.example.Recuriment.recruiter.controller;

import com.example.Recuriment.recruiter.dto.RecruiterRequest;
import com.example.Recuriment.recruiter.dto.RecruiterResponse;
import com.example.Recuriment.recruiter.entity.Recruiter;
import com.example.Recuriment.recruiter.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RecruiterController {
    @Autowired
    RecruiterService recruiterService;
    @PostMapping("/recruiter")
    @PreAuthorize("hasRole('RECRUITER')")
    public String create(@Valid @RequestBody RecruiterRequest request)
    {
        return recruiterService.create(request);
    }
    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/recruiter")
    public ResponseEntity<?> get()
    {
        RecruiterResponse response = recruiterService.get();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/recruiter")
    public ResponseEntity<?> updateBy(@Valid @RequestBody RecruiterRequest request)
    {
        Recruiter recruiter = recruiterService.updateBy(request);
        return  new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
    }
    @PreAuthorize("hasRole('RECRUITER')")
    @DeleteMapping("/recruiter")
    public String deleteById()
    {
        return recruiterService.deleteBy();
    }
}
