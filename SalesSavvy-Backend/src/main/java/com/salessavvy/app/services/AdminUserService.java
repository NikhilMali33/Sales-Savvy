package com.salessavvy.app.services;

import java.util.List;

import com.salessavvy.app.dto.response.UserDetailsResponseDTO;
import com.salessavvy.app.dto.response.UserResponseDTO;

public interface AdminUserService {

    // Get all users
    List<UserResponseDTO> getAllUsers();

    // Get detailed information about one user
    UserDetailsResponseDTO getUserById(int userId);
}