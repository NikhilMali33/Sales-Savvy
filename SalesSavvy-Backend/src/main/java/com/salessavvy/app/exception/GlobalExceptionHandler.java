package com.salessavvy.app.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


    // PRODUCT NOT FOUND
    @ExceptionHandler(ProductNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleProductNotFound(
            ProductNotFoundException ex) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage());
    }


    // ORDER NOT FOUND
    @ExceptionHandler(OrderNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public Map<String, Object> handleOrderNotFound(
            OrderNotFoundException ex) {

        return buildErrorResponse(
                HttpStatus.NOT_FOUND,
                ex.getMessage());
    }


    // INSUFFICIENT STOCK
    @ExceptionHandler(InsufficientStockException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public Map<String, Object> handleInsufficientStock(
            InsufficientStockException ex) {

        return buildErrorResponse(
                HttpStatus.CONFLICT,
                ex.getMessage());
    }


    // ORDER EXCEPTION
    @ExceptionHandler(OrderException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleOrderException(
            OrderException ex) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());
    }


    // PAYMENT EXCEPTION
    @ExceptionHandler(PaymentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handlePaymentException(
            PaymentException ex) {

        return buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                ex.getMessage());
    }


    // VALIDATION FAILURES (@Valid on @RequestBody)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, Object> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, Object> error = buildErrorResponse(
                HttpStatus.BAD_REQUEST,
                "Validation failed");

        Map<String, String> fieldErrors = new HashMap<>();

        ex.getBindingResult().getFieldErrors().forEach(fe ->
                fieldErrors.put(fe.getField(), fe.getDefaultMessage()));

        error.put("fieldErrors", fieldErrors);

        return error;
    }


    // COMMON ERROR RESPONSE
    private Map<String, Object> buildErrorResponse(HttpStatus status, String message) {

        Map<String, Object> error = new HashMap<>();

        error.put("timestamp", LocalDateTime.now());

        error.put("status", status.value());

        error.put("error", status.getReasonPhrase());

        error.put("message", message);

        return error;
    }
}