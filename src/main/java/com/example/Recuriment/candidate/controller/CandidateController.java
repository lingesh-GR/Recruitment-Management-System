package com.example.Recuriment.candidate.controller;

import com.example.Recuriment.candidate.dto.CandidateRequest;
import com.example.Recuriment.candidate.dto.CandidateResponse;
import com.example.Recuriment.candidate.entity.Candidate;
import com.example.Recuriment.candidate.service.CandidateService;
import com.example.Recuriment.user.entity.User;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CandidateController {
    @Autowired
    CandidateService service;
    @PostMapping("/candidate-profile")
    public String createProfile(@Valid  @RequestBody CandidateRequest request)
    {
        return  service.createProfile(request);
    }
    @GetMapping("/candidates")
    public  List<CandidateResponse> getAllProfile()
    {
        return  service.getAllProfile();
    }
    @GetMapping("/candidates/{id}")
    public ResponseEntity<?> getProfileById(@PathVariable Long id)
    {
        CandidateResponse response = service.getProfileById(id);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @GetMapping("/candidate/user/{id}")
    public ResponseEntity<?> getProfileByUserId(@PathVariable Long id)
    {
        CandidateResponse response = service.getProfileByUserID(id);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @PutMapping("/candidates")
    public  ResponseEntity<?> getUpdate(@Valid @RequestBody CandidateRequest request)
    {
        Candidate candidate = service.getUpdate(request);
        return  new ResponseEntity<>("Candidate profile  Updated Successfully",HttpStatus.OK);
    }
    @DeleteMapping("/candidate/{id}")
    public String getDeleteById(@PathVariable Long id)
    {
        return service.getDeleteById(id);
    }
}
