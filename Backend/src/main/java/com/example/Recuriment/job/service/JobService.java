package com.example.Recuriment.job.service;

import com.example.Recuriment.exception.AccessDeniedException;
import com.example.Recuriment.exception.InvalidRoleException;
import com.example.Recuriment.exception.InvalidSalaryException;
import com.example.Recuriment.exception.ResourceNotFoundException;
import com.example.Recuriment.job.dto.JobRequest;
import com.example.Recuriment.job.dto.JobResponse;
import com.example.Recuriment.job.entity.Job;
import com.example.Recuriment.job.repository.JobRepository;
import com.example.Recuriment.recruiter.entity.Recruiter;
import com.example.Recuriment.recruiter.repository.RecruiterRepository;
import com.example.Recuriment.user.entity.Role;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class JobService {
    @Autowired
    JobRepository repository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RecruiterRepository recruiterRepository;
    public String createJob(JobRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id Not Found"));
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElseThrow(
                ()-> new InvalidRoleException("The user is not Recruiter"));
        if(request.getMinSalary().compareTo(request.getMaxSalary()) > 0)
            throw new InvalidSalaryException("The max Salary should be greater than min Salary");
        Job job = new Job();
        BeanUtils.copyProperties(request,job);
        job.setRecruiter(recruiter);
        repository.save(job);
        return "Successfully";
    }
    public List<JobResponse> getAll(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id not found"));
        List<Job> job = new ArrayList<>();
        if(user.getRole() == Role.CANDIDATE)
        {
            job = repository.findAll();
        }
        else if(user.getRole() == Role.RECRUITER)
        {
            Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElseThrow(
                    ()-> new ResourceNotFoundException("The Recruiter Not Update Anything in the Profile"));
            job = repository.findByRecruiterId(recruiter.getId());
            if(job.size() == 0)
                throw new ResourceNotFoundException("There is No Job Found");
        }
        else
            throw new AccessDeniedException("The Access are Denied");
       List<JobResponse> responses = new ArrayList<>();
       for(Job j1 : job)
       {
           JobResponse response = new JobResponse();
           BeanUtils.copyProperties(j1,response);
           responses.add(response);
       }
       return  responses;
    }

    public JobResponse findbyid(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id not found"));
        Job j1 = new Job();
        if(user.getRole() == Role.CANDIDATE)
            j1 = repository.findById(id).orElseThrow(
                    ()-> new ResourceNotFoundException("The Job is Not Found"));
        else if(user.getRole() == Role.RECRUITER)
        {
            Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElseThrow(
                    ()-> new ResourceNotFoundException("The Recruiter Not Update Anything in the Profile"));
            j1 = repository.findByRecruiterIdAndId(recruiter.getId(),id).orElseThrow(
                    ()-> new ResourceNotFoundException("The Recruiter Not Have any Job Post"));
        }
        else
            throw new AccessDeniedException("The Access are Denied");
        JobResponse response = new JobResponse();
        BeanUtils.copyProperties(j1,response);
        return  response;
    }

    public JobResponse updateJob(Long id,JobRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("EmailId not Found"));
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElseThrow(
                ()-> new InvalidRoleException("The user is not Recruiter"));
        Job j = repository.findByRecruiterIdAndId(recruiter.getId(),id).orElseThrow(
                ()-> new ResourceNotFoundException("Job is Not found"));
        if(request.getMinSalary().compareTo(request.getMaxSalary()) > 0)
            throw new InvalidSalaryException("The max Salary should be greater than min Salary");
        BeanUtils.copyProperties(request,j);
        repository.save(j);
        JobResponse response = new JobResponse();
        BeanUtils.copyProperties(j,response);
        return  response;
    }

    public String DeleteById(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("EmailId not Found"));
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElseThrow(
                ()-> new InvalidRoleException("The user is not Recruiter"));
        Job j = repository.findByRecruiterIdAndId(recruiter.getId(),id).orElseThrow(
                ()-> new ResourceNotFoundException("Job is Not Found"));
        repository.deleteById(id);
        return "Job is Deleted";
    }
}
