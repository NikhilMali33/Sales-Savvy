package com.salessavvy.app.serviceImplementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.salessavvy.app.dto.request.CreateUserRequest;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final BCryptPasswordEncoder passwordEncoder;


    @Autowired
    public UserServiceImpl(UserRepository repo) {

        this.repo = repo;

        this.passwordEncoder = new BCryptPasswordEncoder();
    }


    // PUBLIC REGISTRATION
    // CUSTOMER ONLY
    @Override
    public User registerUser(User user) {

        // Check username
        if (repo.findByUsername(user.getUsername()).isPresent()) {

            throw new RuntimeException("Username is already taken");
        }


        // Check email
        if (repo.findByEmail(user.getEmail()).isPresent()) {

            throw new RuntimeException("Email is already Registered");
        }


        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));


        return repo.save(user);
    }


    // ADMIN CREATE USER
    // ADMIN CAN CREATE CUSTOMER OR ADMIN
    @Override
    public User createUserByAdmin(CreateUserRequest request) {

        // Validate username
        if (request.getUsername() == null || request.getUsername().trim().isEmpty()) {

            throw new RuntimeException("Username is required");
        }


        // Validate email
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {

            throw new RuntimeException("Email is required");
        }


        // Validate password
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {

            throw new RuntimeException("Password is required");
        }


        // Validate role
        if (request.getRole() == null) {

            throw new RuntimeException("Role is required");
        }


        // Check username
        if (repo.findByUsername(
                request.getUsername()).isPresent()) {

            throw new RuntimeException("Username is already taken");
        }


        // Check email
        if (repo.findByEmail(request.getEmail()).isPresent()) {

            throw new RuntimeException("Email is already registered");
        }


        // Create new user
        User user = new User();

        user.setUsername(request.getUsername().trim());

        user.setEmail(request.getEmail().trim());

        user.setPassword(passwordEncoder.encode(request.getPassword()));

        user.setRole(request.getRole());

        return repo.save(user);
    }


    // FIND USER BY USERNAME
    @Override
    public User findByUsername(
            String username) {

        return repo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}