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
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RecruiterService {
    @Autowired
    RecruiterRepository repository;
    @Autowired
    UserRepository userRepository;
    public String create(RecruiterRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("The user Is Not found"));
        Recruiter existing = repository.findByUserId(user.getId()).orElse(null);
        if(existing != null)
            throw  new DuplicateException("Already Register");
        Recruiter recruiter = new Recruiter();
        recruiter.setUser(user);
        recruiter.setDesignation(request.getDesignation());
        recruiter.setCompanyName(request.getCompanyName());
        repository.save(recruiter);
        return "Successfully Created";
    }

    public RecruiterResponse get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id not Found"));
        Recruiter recruiter = repository.findByUserId(user.getId()).orElseThrow(
                ()-> new ResourceNotFoundException("Recruiter Id is not Found"));
        RecruiterResponse response = new RecruiterResponse();
        BeanUtils.copyProperties(recruiter,response);
        response.setUserId(user.getId());
        return response;
    }

    public Recruiter updateBy(RecruiterRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id is not Found"));
        Recruiter recruiter = repository.findByUserId(user.getId()).orElseThrow(
                ()-> new ResourceNotFoundException("Recruiter Id is not Found"));
        BeanUtils.copyProperties(request,recruiter);
        recruiter.setUser(user);
        repository.save(recruiter);
        return  recruiter;
    }

    public String deleteBy() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id is not Found"));
        Recruiter recruiter = repository.findByUserId(user.getId()).orElseThrow(
                ()-> new ResourceNotFoundException("The Recruiter is Not Found"));
        repository.deleteById(recruiter.getId());
        return "Deleted by Successfully";
    }
}
