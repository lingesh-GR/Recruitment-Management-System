package com.example.Recuriment.user.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;
    private  String name;
    private  String password;
    @Column(nullable = false , unique = true)
    private String emailid;
    private  String phone;
    @Enumerated(EnumType.STRING)
    private  Role role;
    @Enumerated(EnumType.STRING)
    private AccountStatus accountStatus;
}
