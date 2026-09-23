package com.example.Recuriment.application.service;

import com.example.Recuriment.application.dto.ApplicationRequest;
import com.example.Recuriment.application.dto.ApplicationResponse;
import com.example.Recuriment.application.dto.ApplicationStatusRequest;
import com.example.Recuriment.application.entity.Application;
import com.example.Recuriment.application.entity.ApplicationStatus;
import com.example.Recuriment.application.repository.ApplicationRepository;
import com.example.Recuriment.exception.DuplicateException;
import com.example.Recuriment.exception.InvalidRoleException;
import com.example.Recuriment.exception.InvalidStatusException;
import com.example.Recuriment.exception.ResourceNotFoundException;
import com.example.Recuriment.job.entity.Job;
import com.example.Recuriment.job.repository.JobRepository;
import com.example.Recuriment.user.entity.Role;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationService {
    @Autowired
    ApplicationRepository repository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    JobRepository jobRepository;
    public String create(ApplicationRequest request) {
        User candidate = userRepository.findById(request.getCandidateId()).orElseThrow(()
                ->new ResourceNotFoundException("Candidate Id not Found"));
        Job job = jobRepository.findById(request.getJobId()).orElseThrow(()
        ->new ResourceNotFoundException("Job is Not found"));
        if(candidate.getRole() != Role.CANDIDATE)
           throw new InvalidRoleException("User ID is not Candidate");
        Application application = repository.findByCandidateIdAndJobId(request.getCandidateId(), request.getJobId()).orElse(null);
        if(application != null)
            throw  new DuplicateException("Already is Register");
        Application app = new Application();
        app.setCandidate(candidate);
        app.setJob(job);
        repository.save(app);
        return  "Successfully Created";
    }

    public List<ApplicationResponse> getAll() {
        List<Application> applications = repository.findAll();
        List<ApplicationResponse> responses = new ArrayList<>();
        for(Application application : applications)
        {
            ApplicationResponse response = new ApplicationResponse();
            response.setId(application.getId());
            response.setCandidateId(application.getCandidate().getId());
            response.setApplicationStatus(application.getApplicationStatus());
            response.setJobId(application.getJob().getId());
            response.setCreatedAt(application.getCreatedAt());
            response.setUpdateAt(application.getUpdateAt());
            responses.add(response);
        }
        return  responses;
    }

    public ApplicationResponse getById(Long id) {
        Application application = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Application is Not Found"));
        ApplicationResponse response = new ApplicationResponse();
        response.setId(application.getId());
        response.setCandidateId(application.getCandidate().getId());
        response.setJobId(application.getJob().getId());
        response.setApplicationStatus(application.getApplicationStatus());
        response.setCreatedAt(application.getCreatedAt());
        response.setUpdateAt(application.getUpdateAt());
        return  response;
    }

    public Application update(Long id, ApplicationRequest request) {
        Application application = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Application is Not Found"));
        Application app = repository.findByCandidateIdAndJobId(request.getCandidateId(),request.getJobId()).orElse(null);
        User candidate = userRepository.findById(request.getCandidateId()).orElseThrow(
                ()->new ResourceNotFoundException("User Id is not Found"));
        Job job =  jobRepository.findById(request.getJobId()).orElseThrow(
                ()->new ResourceNotFoundException("Job Id is not Found"));
        if(candidate.getRole() != Role.CANDIDATE)
            throw new InvalidRoleException("The User ID is not Candidate");
        if(app != null && app.getId().equals(application.getId()))
            throw new DuplicateException("Duplication is Not Allowed to it");
        application.setCandidate(candidate);
        application.setJob(job);
        repository.save(application);
        return  application;
    }

    public String deleteById(Long id) {
        Application application = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Application Not Found"));
        repository.deleteById(id);
        return  "Deleted Successfully";
    }

    public String updateByStatus(Long id, ApplicationStatusRequest status) {
        Application application = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("Application Not Found"));
        ApplicationStatus current = application.getApplicationStatus();
        ApplicationStatus next =  status.getApplicationStatus();
        // APPLIED → UNDER_REVIEW
        if (current == ApplicationStatus.APPLIED &&
                next == ApplicationStatus.UNDER_REVIEW) {

            application.setApplicationStatus(next);
        }

        // UNDER_REVIEW → SHORTLISTED
        else if (current == ApplicationStatus.UNDER_REVIEW &&
                next == ApplicationStatus.SHORTLISTED) {

            application.setApplicationStatus(next);
        }

        // UNDER_REVIEW → REJECTED
        else if (current == ApplicationStatus.UNDER_REVIEW &&
                next == ApplicationStatus.REJECTED) {

            application.setApplicationStatus(next);
        }

        // SHORTLISTED → HIRED
        else if (current == ApplicationStatus.SHORTLISTED &&
                next == ApplicationStatus.HIRED) {

            application.setApplicationStatus(next);
        }

        // SHORTLISTED → REJECTED
        else if (current == ApplicationStatus.SHORTLISTED &&
                next == ApplicationStatus.REJECTED) {

            application.setApplicationStatus(next);
        }

        else {
            throw new InvalidStatusException("Invalid Status Transition");
        }
        repository.save(application);
        return  "Status Updated Successfully";
    }

    public List<ApplicationResponse> getByJobId(Long jobId) {
        List<Application> applications = repository.findByJobId(jobId);
        List<ApplicationResponse> responses = new ArrayList<>();
        for(Application application : applications)
        {
                ApplicationResponse response = new ApplicationResponse();
                BeanUtils.copyProperties(application,response);
                response.setJobId(application.getJob().getId());
                response.setCandidateId(application.getCandidate().getId());
                responses.add(response);
        }
        return responses;
    }

    public List<ApplicationResponse> getByCandidateId(Long candidateId) {
        List<Application> applications = repository.findByCandidateId(candidateId);
        List<ApplicationResponse> responses = new ArrayList<>();
        for(Application application : applications)
        {
            ApplicationResponse response = new ApplicationResponse();
            BeanUtils.copyProperties(application,response);
            response.setJobId(application.getJob().getId());
            response.setCandidateId(application.getCandidate().getId());
            responses.add(response);
        }
        return responses;
    }
}
