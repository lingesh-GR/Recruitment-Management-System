package com.example.Recuriment.user.controller;

import com.example.Recuriment.user.dto.*;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.service.EmailService;
import com.example.Recuriment.user.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class UserController {
    @Autowired
    UserService userService;
    @Autowired
    EmailService emailService;
    @PostMapping("/register")
    public String createUser(@Valid @RequestBody RegisterRequest request)
    {
        return userService.createUser(request);
    }
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request)
    {
        return userService.verify(request);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public  List<UserResponse> getUser()
    {

        return userService.getUser();
    }
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/user/{id}")
    public ResponseEntity<?> findbyId(@PathVariable("id") Long id)
    {
        UserResponse response = userService.findById(id);
        return  new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/users")
    public  ResponseEntity<?> updateUser(@Valid @RequestBody UserRequest request)
    {
        UserResponse response = userService.updateUser(request);
        return  new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
    }
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public  String deleteById(@PathVariable("id") Long id)
    {
        return userService.deleteById(id);
    }
    @PostMapping("forgot-password")
    public ResponseEntity<?> ForgotPassword(@Valid @RequestBody ForgotPasswordRequest request)
    {
        userService.ForgotPassword(request);
        return new ResponseEntity<>("Email Sent Successfully",HttpStatus.OK);
    }
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(request);

        return new ResponseEntity<>(
                "Password Reset Successfully",
                HttpStatus.OK
        );
    }
}
