package com.salessavvy.app.controllers.admin;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.salessavvy.app.dto.response.UserDetailsResponseDTO;
import com.salessavvy.app.dto.response.UserResponseDTO;
import com.salessavvy.app.services.AdminUserService;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    // CONSTRUCTOR
    public AdminUserController( AdminUserService adminUserService) {

        this.adminUserService = adminUserService;
    }

    // GET ALL USERS
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

        return ResponseEntity.ok(adminUserService.getAllUsers());
    }


    // GET SINGLE USER WITH DETAILS
    @GetMapping("/{userId}")
    public ResponseEntity<UserDetailsResponseDTO> getUserById( @PathVariable int userId) {

        return ResponseEntity.ok(adminUserService.getUserById(userId));
    }
}