package com.example.Recuriment.job.service;

import com.example.Recuriment.exception.InvalidSalaryException;
import com.example.Recuriment.exception.ResourceNotFoundException;
import com.example.Recuriment.job.dto.JobRequest;
import com.example.Recuriment.job.dto.JobResponse;
import com.example.Recuriment.job.entity.Job;
import com.example.Recuriment.job.repository.JobRepository;
import com.example.Recuriment.user.entity.User;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class JobService {
    @Autowired
    JobRepository repository;
    public String createJob(JobRequest request) {
        if(request.getMinSalary().compareTo(request.getMaxSalary()) > 0)
            throw new InvalidSalaryException("The max Salary should be greater than min Salary");
        Job job = new Job();
        BeanUtils.copyProperties(request,job);
        repository.save(job);
        return "Successfully";
    }
    public List<JobResponse> getAll() {
       List<Job> job = repository.findAll();
       List<JobResponse> responses = new ArrayList<>();
       for(Job j1 : job)
       {
           JobResponse response = new JobResponse();
           response.setId(j1.getId());
           response.setTitle(j1.getTitle());
           response.setDescription((j1.getDescription()));
           response.setLocation((j1.getLocation()));
           response.setEmploymentType(j1.getEmploymentType());
           response.setExperienceRequired(j1.getExperienceRequired());
           response.setMinSalary(j1.getMinSalary());
           response.setMaxSalary(j1.getMaxSalary());
           response.setSkillsRequired(j1.getSkillRequired());
           response.setJobStatus(j1.getJobStatus());
           response.setCreatedAt(j1.getCreatedAt());
           response.setUpdatedAt(j1.getUpdatedAt());
           responses.add(response);
       }
       return  responses;
    }

    public JobResponse findbyid(Long id) {
        Job j1 = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Job is not Found"));
        JobResponse response = new JobResponse();
        response.setId(j1.getId());
        response.setTitle(j1.getTitle());
        response.setDescription((j1.getDescription()));
        response.setLocation((j1.getLocation()));
        response.setEmploymentType(j1.getEmploymentType());
        response.setExperienceRequired(j1.getExperienceRequired());
        response.setMinSalary(j1.getMinSalary());
        response.setMaxSalary(j1.getMaxSalary());
        response.setSkillsRequired(j1.getSkillRequired());
        response.setJobStatus(j1.getJobStatus());
        response.setCreatedAt(j1.getCreatedAt());
        response.setUpdatedAt(j1.getUpdatedAt());
        return  response;
    }

    public JobResponse updateJob(Long id,JobRequest request) {
        Job j = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Job is Not found"));
        if(request.getMinSalary().compareTo(request.getMaxSalary()) > 0)
            throw new InvalidSalaryException("The max Salary should be greater than min Salary");
        j.setTitle(request.getTitle());
        j.setDescription(request.getDescription());
        j.setLocation(request.getLocation());
        j.setEmploymentType(request.getEmploymentType());
        j.setExperienceRequired(request.getExperienceRequired());
        j.setMinSalary(request.getMinSalary());
        j.setMaxSalary(request.getMaxSalary());
        j.setSkillRequired(request.getSkillsRequired());
        j.setJobStatus(request.getJobStatus());
        repository.save(j);
        return  findbyid(id);
    }

    public String DeleteById(Long id) {
        Job j = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Job is Not Found"));
        repository.deleteById(id);
        return "Job is Deleted";
    }
}
