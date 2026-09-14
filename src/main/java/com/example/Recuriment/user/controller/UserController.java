package com.example.Recuriment.user.controller;

import com.example.Recuriment.user.dto.UserRequest;
import com.example.Recuriment.user.dto.UserResponse;
import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")
public class UserController {
    @Autowired
    UserService userService;
    @PostMapping("/users")
    public String createUser(@RequestBody List<User> user)
    {
        return userService.createUser(user);
    }
    @GetMapping("/users/email/{emailid}")
    public  ResponseEntity<?> findbyEmail(@PathVariable("emailid") String emailid)
    {
        UserResponse response = userService.findEmail(emailid);
        if(response == null)
            return  new ResponseEntity<>("User Not found",HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }
    @GetMapping("/users")
    public  List<UserResponse> getAllUser()
    {
        return userService.getAllUser();
    }
    @GetMapping("/users/{id}")
    public ResponseEntity<?> findbyId(@PathVariable("id") Long id)
    {
        UserResponse response = userService.findById(id);
        if(response == null)
            return  new ResponseEntity<>("User Not found",HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>(response, HttpStatus.OK);
    }
    @PutMapping("/users/{id}")
    public  ResponseEntity<?> updateUser(@PathVariable("id") Long id , @RequestBody UserRequest request)
    {
        UserResponse response = userService.updateUser(id,request);
        if(response == null)
            return  new ResponseEntity<>("User not Found",HttpStatus.NOT_FOUND);
        return  new ResponseEntity<>("Updated Successfully",HttpStatus.OK);
    }
    @DeleteMapping("/users/{id}")
    public  String deleteById(@PathVariable("id") Long id)
    {
        String result = userService.deleteById(id);
        return  result;
    }
}
