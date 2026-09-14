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
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ApplicationController {
    @Autowired
    ApplicationService service;
    @PostMapping("/applications")
    public  String create(@Valid @RequestBody ApplicationRequest request)
    {
        return service.create(request);
    }
    @GetMapping("/applications")
    public List<ApplicationResponse> getAll()
    {
        return  service.getAll();
    }
    @GetMapping("/applications/{id}")
    public ResponseEntity<?> getById(@PathVariable("id") Long id)
    {
        ApplicationResponse response = service.getById(id);
        if(response == null)
            return new ResponseEntity<>("JobId is not found", HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @GetMapping("/applications/job/{jobId}")
    public  ResponseEntity<?> getByJobId(@PathVariable Long jobId)
    {
        List<ApplicationResponse> response = service.getByJobId(jobId);
        if(response.size() == 0)
            return  new ResponseEntity<>("No one Register to job",HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @GetMapping("/applications/candidate/{candidateId}")
    public  ResponseEntity<?> getByCandidateId(@PathVariable Long candidateId)
    {
        List<ApplicationResponse> responses = service.getByCandidateId(candidateId);
        if(responses.size() == 0)
            return  new ResponseEntity<>("No one candidate to Found",HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>(responses,HttpStatus.OK);
    }
    @PutMapping("/applications/{id}")
    public ResponseEntity<?> update(@Valid @PathVariable("id") Long id,@RequestBody ApplicationRequest request)
    {
        Application application = service.update(id,request);
        if(application == null)
            return  new ResponseEntity<>("Not to Update",HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
    }
    @PutMapping("/applications/{id}/status")
    public ResponseEntity<?> updateByStatus(@PathVariable("id") Long id , @RequestBody ApplicationStatusRequest status)
    {
        String result = service.updateByStatus(id,status);
        if(result.equals("Application not Found"))
            return new ResponseEntity<>(result,HttpStatus.NOT_FOUND);
        if(result.equals("Invalid Status Transition"))
            return new ResponseEntity<>(result,HttpStatus.BAD_REQUEST);
        return  new ResponseEntity<>(result,HttpStatus.OK);
    }
    @DeleteMapping("/applications/{id}")
    public String deleteById(@PathVariable("id")Long id)
    {
        return  service.deleteById(id);
    }
}
