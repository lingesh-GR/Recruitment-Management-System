package com.example.Recuriment.user.service;

import com.example.Recuriment.user.entity.User;
import com.example.Recuriment.user.entity.userDetails;
import com.example.Recuriment.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class customizeUserDetails implements UserDetailsService {
    @Autowired
    private UserRepository userRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmailid(username).orElseThrow(
                ()-> new UsernameNotFoundException("EmailId Not Found"));
        return new userDetails(user);
    }
}
