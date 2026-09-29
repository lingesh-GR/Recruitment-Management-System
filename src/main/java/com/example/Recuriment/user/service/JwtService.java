package com.example.Recuriment.user.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {
    static final String secretkey = "Iamtokenlingeshgr@061234RolexKaruppuScene";
    static final SecretKey key = Keys.hmacShaKeyFor(secretkey.getBytes());
    public String generateValue(String emailid) {
        return Jwts
                .builder()
                .subject(emailid)
                .signWith(key)
                .issuedAt(new Date())
                .expiration(new Date(
                        System.currentTimeMillis()+1000*60*60
                ))
                .compact();

    }

    public String extractEmail(String token) {
        return  Jwts
                .parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean validateToken(String token) {
         try {
             Jwts
                     .parser()
                     .verifyWith(key)
                     .build()
                     .parseSignedClaims(token);
             return true;
         }
         catch (Exception e)
         {
             return false;
         }
    }
}
