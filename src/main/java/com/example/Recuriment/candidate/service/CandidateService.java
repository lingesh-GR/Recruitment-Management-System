package com.example.Recuriment.candidate.service;

import com.example.Recuriment.candidate.dto.CandidateRequest;
import com.example.Recuriment.candidate.dto.CandidateResponse;
import com.example.Recuriment.candidate.entity.Candidate;
import com.example.Recuriment.candidate.repository.CandidateRepository;
import com.example.Recuriment.user.entity.Role;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import org.apache.coyote.Response;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CandidateService {
    @Autowired
    CandidateRepository repository;
    @Autowired
    UserRepository userRepository;
    public String createProfile(CandidateRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        Candidate cand = repository.findByUserId(request.getUserId()).orElse(null);
        if(user == null)
            return  "Candidate is Not Register";
        if(user.getRole() != Role.CANDIDATE)
            return  "user is not Candidate";
       if(cand != null)
           return "Already Register";
       Candidate candidate = new Candidate();
        BeanUtils.copyProperties(request,candidate);
        candidate.setUser(user);
        repository.save(candidate);
        return  "Successfully Created to it";
    }

    public List<CandidateResponse> getAllProfile() {
        List<Candidate> candidates = repository.findAll();
        List<CandidateResponse> responses = new ArrayList<>();
        for(Candidate cand : candidates)
        {
            CandidateResponse response = new CandidateResponse();
            BeanUtils.copyProperties(cand,response);
            response.setUserId(cand.getUser().getId());
            response.setUserId(cand.getUser().getId());
            response.setName(cand.getUser().getName());
            response.setEmail(cand.getUser().getEmailid());
            response.setPhone(cand.getUser().getPhone());
            responses.add(response);
        }
        return responses;
    }

    public CandidateResponse getProfileById(Long id) {
        Candidate candidate = repository.findById(id).orElse(null);
        if(candidate == null)
            return  null;
        CandidateResponse response = new CandidateResponse();
        BeanUtils.copyProperties(candidate,response);
        response.setUserId(candidate.getUser().getId());
        response.setUserId(candidate.getUser().getId());
        response.setName(candidate.getUser().getName());
        response.setEmail(candidate.getUser().getEmailid());
        response.setPhone(candidate.getUser().getPhone());
        return  response;
    }

    public CandidateResponse getProfileByUserID(Long id) {
        Candidate candidate = repository.findByUserId(id).orElse(null);
        if(candidate == null)
            return  null;
        CandidateResponse response = new CandidateResponse();
        BeanUtils.copyProperties(candidate,response);
        response.setUserId(candidate.getUser().getId());
        response.setUserId(candidate.getUser().getId());
        response.setName(candidate.getUser().getName());
        response.setEmail(candidate.getUser().getEmailid());
        response.setPhone(candidate.getUser().getPhone());
        return  response;
    }

    public Candidate getUpdate(CandidateRequest request) {
        Candidate candidate = repository.findByUserId(request.getUserId()).orElse(null);
        if(candidate == null)
            return  null;
        User user = candidate.getUser();
        BeanUtils.copyProperties(request,candidate);
        candidate.setUser(user);
        repository.save(candidate);
        return candidate;
    }

    public String getDeleteById(Long id) {
        Candidate candidate = repository.findById(id).orElse(null);
        if(candidate == null)
            return "Candidate is not Found";
        repository.deleteById(id);
        return "Candidate is Deleted Successfully";
    }
}
