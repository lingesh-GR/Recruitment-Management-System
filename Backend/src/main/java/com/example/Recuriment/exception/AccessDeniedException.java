package com.example.Recuriment.exception;

public class AccessDeniedException extends RuntimeException{
    public AccessDeniedException(String message)
    {
        super(message);
    }
}
