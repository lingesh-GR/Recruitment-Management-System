package com.example.Recuriment.job.controller;

import com.example.Recuriment.job.dto.JobRequest;
import com.example.Recuriment.job.dto.JobResponse;
import com.example.Recuriment.job.entity.Job;
import com.example.Recuriment.job.service.JobService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class JobController {
    @Autowired
    JobService jobService;
    @PostMapping("/jobs")
    @PreAuthorize("hasRole('RECRUITER')")
    public  String createJob(@Valid  @RequestBody JobRequest request)
    {
        return jobService.createJob(request);
    }
    @PreAuthorize("hasAnyRole('CANDIDATE','RECRUITER')")
    @GetMapping("/jobs")
    public List<JobResponse> getAll()
    {
        return  jobService.getAll();
    }
    @PreAuthorize("hasAnyRole('CANDIDATE','RECRUITER')")
    @GetMapping("/jobs/{id}")
    public ResponseEntity<?> findbyid(@PathVariable("id") Long id)
    {
        JobResponse response = jobService.findbyid(id);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @PreAuthorize("hasRole('RECRUITER')")
    @PutMapping("/jobs/{id}")
    public ResponseEntity<?> updateJob(@PathVariable("id") Long id ,@Valid @RequestBody JobRequest request)
    {
        JobResponse response = jobService.updateJob(id,request);
        return  new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
    }
    @PreAuthorize("hasRole('RECRUITER')")
    @DeleteMapping("/jobs/{id}")
    public  String DeleteById(@PathVariable("id") Long id)
    {
        return jobService.DeleteById(id);
    }
}
