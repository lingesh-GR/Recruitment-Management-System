package com.example.Recuriment.user.service;

import com.example.Recuriment.exception.DuplicateException;
import com.example.Recuriment.exception.ResourceNotFoundException;
import com.example.Recuriment.user.dto.UserRequest;
import com.example.Recuriment.user.dto.UserResponse;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    UserRepository repository;
    public String createUser(UserRequest request) {

        User user = repository.findByEmailid(request.getEmailid()).orElse(null);
        if(user != null)
            throw new DuplicateException("The EmailId already Register to it");
        User user1 = new User();
        BeanUtils.copyProperties(request,user1);
        repository.save(user1);
        return  "Success";
    }

    public List<UserResponse> getAllUser() {
        List<User> users = repository.findAll();
        List<UserResponse> responses = new ArrayList<>();
        for(User user : users)
        {
            UserResponse response = new UserResponse();
            response.setId(user.getId());
            response.setName(user.getName());
            response.setEmailid(user.getEmailid());
            response.setRole(user.getRole());
            response.setPhone(user.getPhone());
            response.setAccountStatus(user.getAccountStatus());
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
        response.setRole(user.getRole());
        response.setEmailid(user.getEmailid());
        response.setPhone(user.getPhone());
        response.setAccountStatus(user.getAccountStatus());
        return  response;
    }

    public UserResponse updateUser(Long id, UserRequest request) {
        User user = repository.findById(id).orElseThrow(
                ()-> new ResourceNotFoundException("The Id is Not Found to it"));
        Optional<User>existingUser = repository.findByEmailid(request.getEmailid());
        if(existingUser.isPresent() && !existingUser.get().getId().equals(id))
            throw new DuplicateException("User EmailId Already Register");
        user.setName(request.getName());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setEmailid(request.getEmailid());
        user.setAccountStatus(request.getAccountStatus());
        repository.save(user);
        return findById(id);
    }

    public String deleteById(Long id) {
        User user = repository.findById(id).orElseThrow(
                ()->new ResourceNotFoundException("The User Id not Found to it"));
        repository.deleteById(id);
        return  "Deleted Successfully";
    }

    public UserResponse findEmail(String emailid) {
        User user = repository.findByEmailid(emailid).orElseThrow(
                ()-> new ResourceNotFoundException("The EmailId is not Found"));
        return findById(user.getId());
    }
}
