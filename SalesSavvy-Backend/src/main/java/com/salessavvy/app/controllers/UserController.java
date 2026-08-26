package com.salessavvy.app.controllers;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.salessavvy.app.dto.request.CreateUserRequest;
import com.salessavvy.app.dto.response.UserResponseDTO;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.enums.Role;
import com.salessavvy.app.services.UserService;

@RestController
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
@RequestMapping("/api/users")
public class UserController {

    private final UserService service;


    public UserController(UserService service) {
        this.service = service;
    }


    // PUBLIC CUSTOMER REGISTRATION
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(
            @RequestBody User user) {

        try {

            // Public registration can ONLY create customers
            user.setRole(Role.CUSTOMER);

            User registeredUser = service.registerUser(user);


            return ResponseEntity.ok(
                    Map.of("message", "User Registered Successfully", "user",
                            new UserResponseDTO(
                                    registeredUser.getUserId(),
                                    registeredUser.getUsername(),
                                    registeredUser.getEmail(),
                                    registeredUser.getRole().toString()
                            )
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // ADMIN CREATE USER
    @PostMapping("/admin/create")
    public ResponseEntity<?> createUserByAdmin(@RequestBody CreateUserRequest request) {

        try {

            // CHECK CURRENTLY LOGGED-IN USER
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


            if (authentication == null || !authentication.isAuthenticated()) {

                return ResponseEntity.status(401).body(Map.of("error", "Authentication required"));
            }


            // CHECK ADMIN ROLE
            boolean isAdmin = authentication.getAuthorities().stream().anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

            if (!isAdmin) {

                return ResponseEntity.status(403).body(Map.of("error", "Only administrators can create users"));
            }


            // CREATE USER
            User createdUser = service.createUserByAdmin(request);


            UserResponseDTO response = new UserResponseDTO(
                            createdUser.getUserId(),
                            createdUser.getUsername(),
                            createdUser.getEmail(),
                            createdUser.getRole().toString()
                    );


            return ResponseEntity.ok(Map.of("message","User created successfully", "user", response));


        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(Map.of("error",e.getMessage()));
        }
    }


    // MY PROFILE
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile() {

        try {

            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();


            if (authentication == null || !authentication.isAuthenticated()) {

                return ResponseEntity.status(401).body(Map.of("error", "User is not authenticated"));
            }


            String username = authentication.getName();


            User user = service.findByUsername(username);


            UserResponseDTO response =
                    new UserResponseDTO(
                            user.getUserId(),
                            user.getUsername(),
                            user.getEmail(),
                            user.getRole().toString()
                    );


            return ResponseEntity.ok(response);


        } catch (RuntimeException e) {

            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}