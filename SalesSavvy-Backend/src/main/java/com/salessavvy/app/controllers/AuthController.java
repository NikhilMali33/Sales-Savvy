package com.salessavvy.app.controllers;

import java.time.Duration;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salessavvy.app.dto.request.ForgotPasswordRequest;
import com.salessavvy.app.dto.request.LoginRequest;
import com.salessavvy.app.dto.request.OtpRequestDTO;
import com.salessavvy.app.dto.request.ResetPasswordRequest;
import com.salessavvy.app.dto.request.VerifyResetOtpRequest;
import com.salessavvy.app.dto.response.LoginResponseDTO;
import com.salessavvy.app.services.AuthService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

        try {

            String message = authService.sendLoginOtp(
                    loginRequest.getUsername(),
                    loginRequest.getPassword());

            return ResponseEntity.ok(
                    Map.of("message", message)
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", e.getMessage()
                    ));

        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequestDTO request) {

        try {

            LoginResponseDTO loginResponse =
                    authService.verifyOtp(
                            request.getUsername(),
                            request.getOtp());

            ResponseCookie cookie = ResponseCookie.from("jwt", loginResponse.getToken())
                    .httpOnly(true)
                    .secure(false)
                    .path("/")
                    .maxAge(Duration.ofHours(1))
                    .sameSite("Lax")
                    .build();

            // Don't expose JWT in response body
            loginResponse.setToken(null);

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(loginResponse);

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", e.getMessage()
                    ));

        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {

        String message = authService.forgotPassword(request.getEmail());

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }

    @PostMapping("/verify-reset-otp")
    public ResponseEntity<?> verifyResetOtp(@RequestBody VerifyResetOtpRequest request) {

        String message = authService.verifyResetOtp(
                request.getEmail(),
                request.getOtp());

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {

        String message = authService.resetPassword(
                request.getEmail(),
                request.getNewPassword());

        return ResponseEntity.ok(
                Map.of("message", message)
        );
    }

    @GetMapping("/test")
    public String test() {
        return "Auth Controller";
    }
}