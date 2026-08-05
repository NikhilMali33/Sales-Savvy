package com.salessavvy.app.services;

import org.springframework.security.core.userdetails.UserDetails;

import com.salessavvy.app.entities.User;

public interface AuthService {
	public User authenticate(String username, String password);
	public String generateToken(User user);
	public void saveToken(User user, String token);
	String verifyOtp(String username, int otp);
	public String generateNewToken(User user);
	public String sendLoginOtp(String username, String password);
	public String forgotPassword(String email);
	String verifyResetOtp(String email, Integer otp);
	String resetPassword(String email, String newPassword);
	boolean validateToken(String token);
	String extractUsername(String token);
	UserDetails loadUserByUsername(String username);
}
