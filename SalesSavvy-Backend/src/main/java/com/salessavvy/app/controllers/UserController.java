package com.salessavvy.app.controllers;

import java.util.Map;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;

import com.salessavvy.app.dto.response.UserResponseDTO;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.enums.Role;
import com.salessavvy.app.serviceImplementation.UserServiceImpl;
import com.salessavvy.app.services.UserService;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RequestMapping("/api/users")
public class UserController {
	
	private final UserService service;

	public UserController(UserServiceImpl service) {
		super();
		this.service = service;
	}
	
	
	@PostMapping("/register")
	public ResponseEntity<?> registerUser(@RequestBody User user) {
		
		try {
			user.setRole(Role.CUSTOMER);
			User registeredUser = service.registerUser(user);
			return ResponseEntity.ok(Map.of("message", "User Registered Successfully", "user", new UserResponseDTO(registeredUser.getUserId(), registeredUser.getUsername(), registeredUser.getEmail(), registeredUser.getRole().toString())));
		} catch (RuntimeException e) {
			return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
			
		}
		
		
	}
	
	@GetMapping("/profile")
	public ResponseEntity<?> getMyProfile() {

	    try {

	        Authentication authentication =
	                SecurityContextHolder
	                        .getContext()
	                        .getAuthentication();

	        if (authentication == null ||
	                !authentication.isAuthenticated()) {

	            return ResponseEntity
	                    .status(401)
	                    .body(Map.of(
	                            "error",
	                            "User is not authenticated"
	                    ));
	        }

	        String username =
	                authentication.getName();

	        User user =
	                service.findByUsername(username);

	        UserResponseDTO response =
	                new UserResponseDTO(
	                        user.getUserId(),
	                        user.getUsername(),
	                        user.getEmail(),
	                        user.getRole().toString()
	                );

	        return ResponseEntity.ok(response);

	    } catch (RuntimeException e) {

	        return ResponseEntity
	                .badRequest()
	                .body(Map.of(
	                        "error",
	                        e.getMessage()
	                ));
	    }
	}	

}
