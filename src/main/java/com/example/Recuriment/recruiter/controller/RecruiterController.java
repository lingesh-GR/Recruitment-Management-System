package com.example.Recuriment.recruiter.controller;

import com.example.Recuriment.recruiter.dto.RecruiterRequest;
import com.example.Recuriment.recruiter.dto.RecruiterResponse;
import com.example.Recuriment.recruiter.entity.Recruiter;
import com.example.Recuriment.recruiter.service.RecruiterService;
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
    public String createAll(@RequestBody RecruiterRequest request)
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
        if(response == null)
            return new ResponseEntity<>("Recruiter Not Found", HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>(response,HttpStatus.OK);
    }
    @PutMapping("/recruiters/{id}")
    public ResponseEntity<?> updateBy(@PathVariable("id") Long id,@RequestBody RecruiterRequest request)
    {
        Recruiter recruiter = recruiterService.updateBy(id,request);
        if(recruiter == null)
            return  new ResponseEntity<>("Recruiter Not Found",HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
    }
    @DeleteMapping("/recruiters/{id}")
    public String deleteById(@PathVariable("id") Long id)
    {
        return recruiterService.deleteById(id);
    }
}
