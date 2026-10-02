package com.example.Recuriment.exception;

public class BadCredentialsException extends RuntimeException{
    BadCredentialsException(String message)
    {
        super((message));
    }
}
