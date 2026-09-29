package com.example.Recuriment.user.service;

import com.example.Recuriment.exception.AccessDeniedException;
import com.example.Recuriment.exception.DuplicateException;
import com.example.Recuriment.exception.InvalidRoleException;
import com.example.Recuriment.exception.ResourceNotFoundException;
import com.example.Recuriment.user.dto.*;
import com.example.Recuriment.user.entity.AccountStatus;
import com.example.Recuriment.user.entity.Role;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository repository;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtService jwt;
    public String createUser(RegisterRequest request) {
        final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        User user = repository.findByEmailid(request.getEmailid()).orElse(null);
        if(user != null)
            throw new DuplicateException("The EmailId already Register to it");
        if (request.getRole() != Role.CANDIDATE &&
                request.getRole() != Role.RECRUITER) {

            throw new InvalidRoleException(
                    "Only Candidate or Recruiter registration is allowed"
            );
        }
        User user1 = new User();
        BeanUtils.copyProperties(request,user1);
        String password = encoder.encode(request.getPassword());
        user1.setPassword(password);
        user1.setAccountStatus(AccountStatus.ACTIVE);
        repository.save(user1);
        return  "Success";
    }

    public List<UserResponse> getUser() {
        List<User> users = repository.findAll();
        List<UserResponse> responses = new ArrayList<>();
        for(User user : users)
        {
            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setName(user.getName());
            response.setEmailid(user.getEmailid());
            response.setPhone(user.getPhone());
            responses.add(response);
        }
        return  responses;
    }

    public UserResponse findById(Long id) {
        User user = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("The Id is Not found"));
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setName(user.getName());
        response.setEmailid(user.getEmailid());
        response.setPhone(user.getPhone());
        return  response;
    }

    public UserResponse updateUser(UserRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User user = repository.findByEmailid(emailId)
                .orElseThrow(() -> new ResourceNotFoundException("User is not Found"));
        Optional<User> existingUser =  repository.findByEmailid(user.getEmailid());
        if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
            throw new DuplicateException(
                    "User EmailId Already Registered");
        }
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
            user.setPassword(encoder.encode(request.getPassword()));
        }
        repository.save(user);
        return findById(user.getId());
    }

    public String deleteById(Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailId = authentication.getName();
        User use = repository.findByEmailid(emailId).orElseThrow(
                ()-> new AccessDeniedException("Access are Denied"));
        User user = repository.findById(id).orElseThrow(
                ()->new ResourceNotFoundException("The User Id not Found to it"));
        repository.deleteById(id);
        return  "Deleted Successfully";
    }
    public LoginResponse verify(LoginRequest request) {
            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmailid(),
                                    request.getPassword()
                            )
                    );
            if (authentication.isAuthenticated()) {

                String token = jwt.generateValue(request.getEmailid());
                LoginResponse response = new LoginResponse();
                response.setToken(token);
                User user = repository.findByEmailid(request.getEmailid()).orElseThrow(
                        ()-> new ResourceNotFoundException("EmailId is Not Found")
                );
                BeanUtils.copyProperties(user,response);
                return response;
            }
            throw  new BadCredentialsException("Invalid EmailId or Password");
    }
}
