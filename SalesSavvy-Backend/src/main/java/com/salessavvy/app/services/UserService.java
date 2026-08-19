package com.salessavvy.app.services;

import com.salessavvy.app.entities.User;

public interface UserService {
	
	public User registerUser(User user);
	
	 User findByUsername(String username);
	

}
