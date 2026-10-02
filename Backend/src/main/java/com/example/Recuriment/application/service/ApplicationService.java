package com.example.Recuriment.application.service;

import com.example.Recuriment.application.dto.ApplicationRequest;
import com.example.Recuriment.application.dto.ApplicationResponse;
import com.example.Recuriment.application.dto.ApplicationStatusRequest;
import com.example.Recuriment.application.entity.Application;
import com.example.Recuriment.application.entity.ApplicationStatus;
import com.example.Recuriment.application.repository.ApplicationRepository;
import com.example.Recuriment.exception.*;
import com.example.Recuriment.job.entity.Job;
import com.example.Recuriment.job.repository.JobRepository;
import com.example.Recuriment.recruiter.entity.Recruiter;
import com.example.Recuriment.recruiter.repository.RecruiterRepository;
import com.example.Recuriment.user.entity.Role;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.config.ConfigDataResourceNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @Autowired
    private RecruiterRepository recruiterRepository;
    public String create(ApplicationRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User candidate = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("EmailId not found"));
        Job job = jobRepository.findById(request.getJobId()).orElseThrow(
                ()-> new ResourceNotFoundException("The Job is not Found"));
        Application existing = repository.findByCandidateIdAndJobId(candidate.getId(), job.getId()).orElse(null);
        if(existing != null)
            throw  new DuplicateException("Already Register");
        Application application = new Application();
        application.setCandidate(candidate);
        application.setJob(job);
        repository.save(application);
        return  "Successfully Created";
    }

    public List<ApplicationResponse> getAll()
    {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id not Found"));
        List<Application> applications = new ArrayList<>();
        if(user.getRole() == Role.CANDIDATE)
            applications = repository.findByCandidateId(user.getId());
        else if(user.getRole() == Role.RECRUITER)
        {
            Recruiter recruiter = recruiterRepository
                    .findByUserId(user.getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Recruiter not found"));

            applications =
                    repository.findByJobRecruiterId(recruiter.getId());
        }
        else
            throw new AccessDeniedException("Access are Denied");
        List<ApplicationResponse> responses = new ArrayList<>();
        for(Application application : applications)
        { ApplicationResponse response = new ApplicationResponse();
            BeanUtils.copyProperties(application,response);
            response.setCandidateId(application.getCandidate().getId());
            response.setJobId(application.getJob().getId());
            responses.add(response);
        }
        return responses;
    }
    public ApplicationResponse getById(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailid = authentication.getName();
        User user = userRepository.findByEmailid(emailid).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id not found"));
        Application application;
        if(user.getRole() == Role.CANDIDATE)
        {
            application = repository.findByIdAndCandidateId(id, user.getId()).orElseThrow(
                    ()-> new ResourceNotFoundException("The Candidate not have anything to it"));
        }
        else if(user.getRole() == Role.RECRUITER)
        {
            Recruiter recruiter = recruiterRepository
                    .findByUserId(user.getId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException("Recruiter not found"));
            application = repository.findByIdAndJobRecruiterId(id,recruiter.getId()).orElseThrow(
                    ()-> new ResourceNotFoundException("The Recruiter Not have anything Applications"));
        }
        else
            throw  new AccessDeniedException("The Access are Denied");
        ApplicationResponse response = new ApplicationResponse();
        BeanUtils.copyProperties(application,response);
        response.setCandidateId(application.getCandidate().getId());
        response.setJobId(application.getJob().getId());
        return  response;
    }
    public String deleteById(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id is not Found"));
        Application application = repository.findByIdAndCandidateId(id, user.getId()).orElseThrow(
                ()-> new ResourceNotFoundException("Application Not Found"));
        repository.deleteById(id);
        return  "Deleted Successfully";
    }
    public String updateByStatus(Long id, ApplicationStatusRequest status) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId).orElseThrow(
                ()-> new ResourceNotFoundException("Email Id is not Found"));
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId()).orElseThrow(
                ()-> new ResourceNotFoundException("Recruiter is Not Found"));
        Application application = repository.findByIdAndJobRecruiterId(id, recruiter.getId()).orElseThrow(
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
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = userRepository.findByEmailid(emailId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Email Id is not Found"));
        Recruiter recruiter = recruiterRepository.findByUserId(user.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Recruiter not found"));
        List<Application> applications =
                repository.findByJobIdAndJobRecruiterId(
                        jobId,
                        recruiter.getId()
                );
        if (applications.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No applications found for this job"
            );
        }
        List<ApplicationResponse> responses = new ArrayList<>();
        for (Application application : applications) {
            ApplicationResponse response = new ApplicationResponse();
            BeanUtils.copyProperties(application, response);
            response.setJobId(application.getJob().getId());
            response.setCandidateId(application.getCandidate().getId());
            responses.add(response);
        }
        return responses;
    }

    public List<ApplicationResponse> getByCandidateId(Long candidateId) {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();

        User candidate = userRepository.findByEmailid(emailId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Candidate not found"));
        // Object-level authorization
        if (!candidate.getId().equals(candidateId)) {
            throw new AccessDeniedException(
                    "You can access only your own applications"
            );
        }
        List<Application> applications =
                repository.findByCandidateId(candidateId);
        List<ApplicationResponse> responses = new ArrayList<>();
        for (Application application : applications) {
            ApplicationResponse response = new ApplicationResponse();
            BeanUtils.copyProperties(application, response);
            response.setCandidateId(
                    application.getCandidate().getId()
            );
            response.setJobId(
                    application.getJob().getId()
            );
            responses.add(response);
        }
        return responses;
    }
}
