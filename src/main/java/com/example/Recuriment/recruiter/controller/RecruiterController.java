package com.example.Recuriment.recruiter.controller;

import com.example.Recuriment.recruiter.dto.RecruiterRequest;
import com.example.Recuriment.recruiter.dto.RecruiterResponse;
import com.example.Recuriment.recruiter.entity.Recruiter;
import com.example.Recuriment.recruiter.service.RecruiterService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class RecruiterController {
    @Autowired
    RecruiterService recruiterService;
    @PostMapping("/recruiters")
    public String createAll(@Valid @RequestBody RecruiterRequest request)
    {
        return recruiterService.createAll(request);
    }
    @GetMapping("/recruiters")
    public List<RecruiterResponse> getAll()
    {
        return recruiterService.getAll();
    }
    @GetMapping("/recruiters/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id)
    {
        RecruiterResponse response = recruiterService.getById(id);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @PutMapping("/recruiters/{recruiterId}")
    public ResponseEntity<?> updateBy(@PathVariable("recruiterId") Long recruiterId,@Valid @RequestBody RecruiterRequest request)
    {
        Recruiter recruiter = recruiterService.updateBy(recruiterId,request);
        return  new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
    }
    @DeleteMapping("/recruiters/{recruiterId}")
    public String deleteById(@PathVariable("recruiterId") Long recruiterId)
    {
        return recruiterService.deleteById(recruiterId);
    }
}
