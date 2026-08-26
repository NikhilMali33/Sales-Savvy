package com.salessavvy.app.services;

import com.salessavvy.app.dto.request.CreateUserRequest;
import com.salessavvy.app.entities.User;

public interface UserService {

    User registerUser(User user);

    User createUserByAdmin(CreateUserRequest request);

    User findByUsername(String username);
}