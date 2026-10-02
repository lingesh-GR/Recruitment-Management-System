package com.example.Recuriment.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationException(
            MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>();

        exception.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> handleResourceNotFoundException(ResourceNotFoundException exception)
    {
        return new ResponseEntity<>(exception.getMessage(),HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler(InvalidRoleException.class)
    public  ResponseEntity<?> handleInvalidRoleException(InvalidRoleException exception)
    {
        return new ResponseEntity<>(exception.getMessage(),HttpStatus.BAD_REQUEST);
    }
    @ExceptionHandler(DuplicateException.class)
    public  ResponseEntity<?> handleDuplicateException(DuplicateException exception)
    {
        return  new ResponseEntity<>(exception.getMessage(),HttpStatus.CONFLICT);
    }
    @ExceptionHandler(InvalidSalaryException.class)
    public ResponseEntity<?> handleInvalidSalaryException(InvalidSalaryException exception)
    {
        return  new ResponseEntity<>(exception.getMessage(),HttpStatus.CONFLICT);
    }
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException exception)
    {

        return new ResponseEntity<>(exception.getMessage(),HttpStatus.FORBIDDEN);
    }
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(
            BadCredentialsException exception) {

        Map<String, String> error = new HashMap<>();
        error.put("error", "Invalid EmailId or Password");

        return new ResponseEntity<>(error, HttpStatus.UNAUTHORIZED);
    }
}