package com.example.Recuriment.application.controller;

import com.example.Recuriment.application.dto.ApplicationRequest;
import com.example.Recuriment.application.dto.ApplicationResponse;
import com.example.Recuriment.application.dto.ApplicationStatusRequest;
import com.example.Recuriment.application.entity.Application;
import com.example.Recuriment.application.entity.ApplicationStatus;
import com.example.Recuriment.application.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ApplicationController {
    @Autowired
    ApplicationService service;
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/applications")
    public  String create(@Valid @RequestBody ApplicationRequest request)
    {
        return service.create(request);
    }
    @PreAuthorize("hasAnyRole('RECRUITER','CANDIDATE')")
    @GetMapping("/applications")
    public List<ApplicationResponse> getAll()
    {
        return  service.getAll();
    }
    @PreAuthorize("hasAnyRole('RECRUITER','CANDIDATE')")
    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id)
    {
        ApplicationResponse response = service.getById(id);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @PreAuthorize("hasRole('RECRUITER')")
    @GetMapping("/applications/job/{jobId}")
    public  ResponseEntity<?> getByJobId(@PathVariable Long jobId)
    {
        List<ApplicationResponse> response = service.getByJobId(jobId);
        if(response.size() == 0)
            return  new ResponseEntity<>("No one Register to job",HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('RECRUITER','CANDIDATE')")
    @GetMapping("/applications/candidate/{candidateId}")
    public  ResponseEntity<?> getByCandidateId(@PathVariable Long candidateId)
    {
        List<ApplicationResponse> responses = service.getByCandidateId(candidateId);
        if(responses.size() == 0)
            return  new ResponseEntity<>("No one candidate to Found",HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>(responses,HttpStatus.OK);
    }
    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateByStatus(@PathVariable("id") Long id ,@Valid @RequestBody ApplicationStatusRequest status)
    {
        String result = service.updateByStatus(id,status);
        return  new ResponseEntity<>(result,HttpStatus.OK);
    }
    @PreAuthorize("hasRole('CANDIDATE')")
    @DeleteMapping("/applications/{id}")
    public String deleteById(@PathVariable("id")Long id)
    {
        return  service.deleteById(id);
    }
}
