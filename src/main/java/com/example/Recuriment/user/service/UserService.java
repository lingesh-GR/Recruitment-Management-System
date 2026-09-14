package com.example.Recuriment.user.service;

import com.example.Recuriment.user.dto.UserRequest;
import com.example.Recuriment.user.dto.UserResponse;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserService {
    @Autowired
    UserRepository repository;
    public String createUser(List<User> user) {
        repository.saveAll(user);
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
        User user = repository.findById(id).orElse(null);
        UserResponse response = new UserResponse();
        if(user == null)
            return  null;
        response.setId(user.getId());
        response.setName(user.getName());
        response.setRole(user.getRole());
        response.setEmailid(user.getEmailid());
        response.setPhone(user.getPhone());
        response.setAccountStatus(user.getAccountStatus());
        return  response;
    }

    public UserResponse updateUser(Long id, UserRequest request) {
        User user = repository.findById(id).orElse(null);
        if(user == null)
            return  null;
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
        User user = repository.findById(id).orElse(null);
        if(user == null)
            return "User Not found";
        repository.deleteById(id);
        return  "Deleted Successfully";
    }

    public UserResponse findEmail(String emailid) {
        User user = repository.findByEmailid(emailid).orElse(null);
        if(user == null)
            return  null;
        return findById(user.getId());
    }
}
