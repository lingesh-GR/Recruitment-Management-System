package com.example.Recuriment.recruiter.service;

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
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if(user == null)
            return "User is Not Found";
        if(user.getRole() != Role.RECRUITER)
            return "User is Not Recruiter";
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
        Recruiter recruiter = repository.findById(id).orElse(null);
        if(recruiter == null)
             return  null;
       RecruiterResponse response = new RecruiterResponse();
       response.setId(recruiter.getId());
       response.setUserId(recruiter.getUser().getId());
       response.setDesignation(recruiter.getDesignation());
       response.setCompanyName(recruiter.getCompanyName());
       response.setCreatedAt(recruiter.getCreatedAt());
       response.setUpdatedAt(recruiter.getUpdatedAt());
       return  response;
    }

    public Recruiter updateBy(Long id, RecruiterRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        Recruiter recruiter = repository.findById(id).orElse(null);
        if(user == null || recruiter == null)
            return  null;
        if(user.getRole() != Role.RECRUITER)
            return  null;
        recruiter.setUser(user);
        recruiter.setDesignation(request.getDesignation());
        recruiter.setCompanyName(request.getCompanyName());
        repository.save(recruiter);
        return  recruiter;
    }

    public String deleteById(Long id) {
        Recruiter recruiter = repository.findById(id).orElse(null);
        if(recruiter == null)
            return "Recruitter Not Found";
        repository.deleteById(id);
        return "Deleted by Successfully";
    }
}
