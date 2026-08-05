package com.salessavvy.app.serviceImplementation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.salessavvy.app.entities.User;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.UserService;

@Service
public class UserServiceImpl implements UserService{
	
	private final UserRepository repo;
	private final BCryptPasswordEncoder passwordEncoder;
	
	@Autowired
	public UserServiceImpl(UserRepository repo) {
		this.repo = repo;
		this.passwordEncoder = new BCryptPasswordEncoder();
	}

	@Override
	public User registerUser(User user) {
		
		//Check if Username or Email already Exists
		if(repo.findByUsername(user.getUsername()).isPresent()) {
			throw new RuntimeException("Username is already taken");
		}
		
		if(repo.findByEmail(user.getEmail()).isPresent()) {
			throw new RuntimeException("Email is already Registered");
		}
		
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		
		return repo.save(user);
	}
	

}
