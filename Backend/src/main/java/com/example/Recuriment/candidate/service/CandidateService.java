package com.example.Recuriment.candidate.service;

import com.example.Recuriment.application.entity.Application;
import com.example.Recuriment.application.repository.ApplicationRepository;
import com.example.Recuriment.candidate.dto.CandidateRequest;
import com.example.Recuriment.candidate.dto.CandidateResponse;
import com.example.Recuriment.candidate.entity.Candidate;
import com.example.Recuriment.candidate.repository.CandidateRepository;
import com.example.Recuriment.exception.AccessDeniedException;
import com.example.Recuriment.exception.DuplicateException;
import com.example.Recuriment.exception.InvalidRoleException;
import com.example.Recuriment.exception.ResourceNotFoundException;
import com.example.Recuriment.recruiter.entity.Recruiter;
import com.example.Recuriment.recruiter.repository.RecruiterRepository;
import com.example.Recuriment.user.entity.Role;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import org.apache.coyote.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CandidateService {
    @Autowired
    CandidateRepository repository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    private RecruiterRepository recruiterRepository;
    @Autowired
    private ApplicationRepository applicationRepository;
    public String createProfile(CandidateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id is not Found"));
        Candidate cand = repository.findByUserId(user.getId()).orElse(null);
        if(cand != null)
            throw  new DuplicateException("Already is Register");
        Candidate candidate = new Candidate();
        BeanUtils.copyProperties(request,candidate);
        candidate.setUser(user);
        repository.save(candidate);
        return  "Successfully Created to it";
    }
    public CandidateResponse getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("EmailId is not Found"));
        Candidate candidate = repository.findByUserId(user.getId()).orElseThrow(
                ()-> new ResourceNotFoundException("Candidate is not Found"));
        CandidateResponse response = new CandidateResponse();
        BeanUtils.copyProperties(candidate,response);
        response.setName(user.getName());
        response.setEmail(user.getEmailid());
        response.setPhone(user.getPhone());
        response.setUserId(user.getId());
        return response;
    }
    public CandidateResponse getProfileByUserID(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id is not Found"));
        if(user.getRole() == Role.RECRUITER)
        {
            Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElseThrow(
                    ()-> new ResourceNotFoundException("User is not Recruiter"));
            Application application = applicationRepository.findByCandidateIdAndJobRecruiterId(id,recruiter.getId()).orElseThrow(
                    ()-> new AccessDeniedException("Access are Denied"));
        }
        Candidate candidate = repository.findByUserId(id).orElseThrow(
                ()-> new ResourceNotFoundException("Candidate ID is not Found"));
        CandidateResponse response = new CandidateResponse();
        BeanUtils.copyProperties(candidate,response);
        response.setUserId(candidate.getUser().getId());
        response.setName(candidate.getUser().getName());
        response.setEmail(candidate.getUser().getEmailid());
        response.setPhone(candidate.getUser().getPhone());
        return  response;
    }
    public Candidate getUpdate(CandidateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id is not Found"));
        Candidate candidate = repository.findByUserId(user.getId()).orElseThrow(
                ()-> new ResourceNotFoundException("Candidate Id is Not Found"));
        BeanUtils.copyProperties(request,candidate);
        candidate.setUser(user);
        repository.save(candidate);
        return candidate;
    }
    public String getDelete() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id is not Found"));
        Candidate candidate = repository.findByUserId(user.getId()).orElseThrow(
                ()-> new ResourceNotFoundException("CandidateID is Not Found to it"));
        repository.deleteById(candidate.getId());
        return "Candidate is Deleted Successfully";
    }
}