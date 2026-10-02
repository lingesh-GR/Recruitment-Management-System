package com.example.Recuriment.candidate.controller;

import com.example.Recuriment.candidate.dto.CandidateRequest;
import com.example.Recuriment.candidate.dto.CandidateResponse;
import com.example.Recuriment.candidate.service.CandidateService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class CandidateController {

    @Autowired
    private CandidateService service;
    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/candidate-profile")
    public String createProfile(
            @Valid @RequestBody CandidateRequest request) {

        return service.createProfile(request);
    }
    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/candidate-profile")
    public ResponseEntity<?> getProfile() {
        CandidateResponse response = service.getProfile();
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @GetMapping("/candidate/user/{id}")
    public ResponseEntity<?> getProfileByUserId(
            @PathVariable Long id) {

        CandidateResponse response =
                service.getProfileByUserID(id);

        return new ResponseEntity<>(
                response,
                HttpStatus.OK
        );
    }
    @PreAuthorize("hasRole('CANDIDATE')")
    @PutMapping("/candidates")
    public ResponseEntity<?> updateProfile(
            @Valid @RequestBody CandidateRequest request) {

        service.getUpdate(request);

        return new ResponseEntity<>(
                "Candidate profile Updated Successfully",
                HttpStatus.OK
        );
    }
    @PreAuthorize("hasRole('CANDIDATE')")
    @DeleteMapping("/candidate")
    public String delete() {
        return service.getDelete();
    }
}