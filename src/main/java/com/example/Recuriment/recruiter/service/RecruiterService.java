package com.example.Recuriment.recruiter.service;

import com.example.Recuriment.exception.DuplicateException;
import com.example.Recuriment.exception.InvalidRoleException;
import com.example.Recuriment.exception.ResourceNotFoundException;
import com.example.Recuriment.recruiter.dto.RecruiterRequest;
import com.example.Recuriment.recruiter.dto.RecruiterResponse;
import com.example.Recuriment.recruiter.entity.Recruiter;
import com.example.Recuriment.recruiter.repository.RecruiterRepository;
import com.example.Recuriment.user.entity.Role;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecruiterService {
    @Autowired
    RecruiterRepository repository;
    @Autowired
    UserRepository userRepository;
    public String createAll(RecruiterRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(
                ()-> new ResourceNotFoundException("The user Is Not found"));
        if(user.getRole() != Role.RECRUITER)
            throw new InvalidRoleException("The user is not Recruiter");
        Recruiter recruiter = new Recruiter();
        recruiter.setUser(user);
        recruiter.setDesignation(request.getDesignation());
        recruiter.setCompanyName(request.getCompanyName());
        repository.save(recruiter);
        return "Successfully Created";
    }

    public List<RecruiterResponse> getAll() {
        List<RecruiterResponse> responses = new ArrayList<>();
        List<Recruiter> recruiters = repository.findAll();
        for(Recruiter recruiter : recruiters)
        {
            RecruiterResponse response = new RecruiterResponse();
            response.setId(recruiter.getId());
            response.setUserId(recruiter.getUser().getId());
            response.setDesignation(recruiter.getDesignation());
            response.setCompanyName(recruiter.getCompanyName());
            response.setCreatedAt(recruiter.getCreatedAt());
            response.setUpdatedAt(recruiter.getUpdatedAt());
            responses.add(response);
        }
        return responses;
    }

    public RecruiterResponse getById(Long id) {
        Recruiter recruiter = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("The Recruiter is not Found"));
       RecruiterResponse response = new RecruiterResponse();
       response.setId(recruiter.getId());
       response.setUserId(recruiter.getUser().getId());
       response.setDesignation(recruiter.getDesignation());
       response.setCompanyName(recruiter.getCompanyName());
       response.setCreatedAt(recruiter.getCreatedAt());
       response.setUpdatedAt(recruiter.getUpdatedAt());
       return  response;
    }

    public Recruiter updateBy(Long recruiterId, RecruiterRequest request) {
        User user = userRepository.findById(request.getUserId()).orElseThrow(
                ()-> new ResourceNotFoundException("The userId is not Found"));
        Recruiter recruiter = repository.findById(recruiterId).orElseThrow(
                ()-> new ResourceNotFoundException("The Recruiter Id is not Found"));
        if(user.getRole() != Role.RECRUITER)
            throw new InvalidRoleException("The user is not Recruiter");
        Recruiter recur = repository.findByUserId(request.getUserId()).orElseThrow(
                ()-> new ResourceNotFoundException("The User Id is not Fill the Profile"));
        if(!recur.getId().equals(recruiterId))
            throw new DuplicateException("The User already have the Profile to it");
        recruiter.setUser(user);
        recruiter.setDesignation(request.getDesignation());
        recruiter.setCompanyName(request.getCompanyName());
        repository.save(recruiter);
        return  recruiter;
    }

    public String deleteById(Long recruiterId) {
        Recruiter recruiter = repository.findById(recruiterId).orElseThrow(
                ()-> new ResourceNotFoundException("The Recruiter is Not Found"));
        repository.deleteById(recruiterId);
        return "Deleted by Successfully";
    }
}
