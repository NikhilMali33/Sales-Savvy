package com.salessavvy.app.serviceImplementation;

import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.salessavvy.app.entities.JWTToken;
import com.salessavvy.app.entities.OTPVerification;
import com.salessavvy.app.entities.User;
import com.salessavvy.app.repositories.JWTTokenRepository;
import com.salessavvy.app.repositories.OTPRepository;
import com.salessavvy.app.repositories.UserRepository;
import com.salessavvy.app.services.AuthService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import java.security.Key;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthServiceImpl implements AuthService{
	private final UserRepository userRepository;
	private final JWTTokenRepository jwttOkenRepo;
	
	
	private final JavaMailSender mailSender;
	private final OTPRepository otpRepo;
	
	private final Key SIGNING_KEY;
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	
	public AuthServiceImpl(UserRepository userRepository, JWTTokenRepository jwttOkenRepo, BCryptPasswordEncoder bCryptPasswordEncoder,
			 @Value("${jwt.secret}") String jwtSecret, OTPRepository otpRepo, JavaMailSender mailSender ) {
		super();
		this.userRepository = userRepository;
		this.jwttOkenRepo = jwttOkenRepo;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
		
		if(jwtSecret.getBytes(StandardCharsets.UTF_8).length < 64) {
			throw new IllegalArgumentException("JWT_Secret Key must be at least 64  byte");
		}
		this.otpRepo = otpRepo;
		this.mailSender = mailSender;
		
		this.SIGNING_KEY = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
	}





	@Override
	public User authenticate(String username, String password) {
		User user = userRepository.findByUsername(username).orElseThrow(() -> 
		new RuntimeException("Invalid username or password"));
		
		if(!bCryptPasswordEncoder.matches(password, user.getPassword())) {
			throw new RuntimeException("Invalid Username or Password");
		}
		
		
		return user;
	}

	@Override
	public String generateToken(User user) {
		
		String token;
		LocalDateTime now = LocalDateTime.now();
		JWTToken existingToken = jwttOkenRepo.findByUserId(user.getUserId());
		
		if(existingToken != null && now.isBefore(existingToken.getExpiresat())) {
			token = existingToken.getToken();
		}else {
			token = generateNewToken(user);
			if(existingToken != null) {
				jwttOkenRepo.delete(existingToken);
			}
			saveToken(user, token);
		}
		
		return token;
	}

	
	@Override
	public String generateNewToken(User user) {
		return Jwts.builder()
				.setSubject(user.getUsername())
				.claim("role", user.getRole())
				.setIssuedAt(new Date())
				.setExpiration(new Date(System.currentTimeMillis() + 3600000))
				.signWith(SIGNING_KEY, io.jsonwebtoken.SignatureAlgorithm.HS512)
				.compact();
	}
	
	@Override
	public void saveToken(User user, String token) {
		
		JWTToken jwtTokens = new JWTToken(user, token, LocalDateTime.now().plusHours(1));
		jwttOkenRepo.save(jwtTokens);
	}
	
	
	@Override
	public String sendLoginOtp(String username, String password) {

	    User user = authenticate(username, password);

	    OTPVerification existingOtp = otpRepo.findByUser(user);

	    if (existingOtp != null) {
	        otpRepo.delete(existingOtp);
	    }

	    int otp = new Random().nextInt(900000) + 100000;

	    OTPVerification otpEntity = new OTPVerification();
	    otpEntity.setOtpValue(otp);
	    otpEntity.setCreatedAt(LocalDateTime.now());
	    otpEntity.setUser(user);

	    otpRepo.save(otpEntity);

	    SimpleMailMessage message = new SimpleMailMessage();
	    message.setTo(user.getEmail());
	    message.setSubject("SalesSavvy Login OTP");
	    message.setText("Your OTP is: " + otp + "\n\nIt is valid for 5 minutes.");

	    mailSender.send(message);

	    return "OTP sent successfully";
	}
	
	@Override
	public String verifyOtp(String username, int otp) {

	    User user = userRepository.findByUsername(username)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    OTPVerification otpEntity = otpRepo.findByUser(user);

	    if (otpEntity == null) {
	        throw new RuntimeException("OTP not found");
	    }

	    if (otpEntity.getOtpValue() != otp) {
	        throw new RuntimeException("Invalid OTP");
	    }

	    long minutes = Duration.between(
	            otpEntity.getCreatedAt(),
	            LocalDateTime.now())
	            .toMinutes();

	    if (minutes > 5) {
	        otpRepo.delete(otpEntity);
	        throw new RuntimeException("OTP Expired");
	    }

	    otpRepo.delete(otpEntity);

	    String token = generateToken(user);

	    

	    return token;
	}
	
	@Override
	public String forgotPassword(String email) {

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    int otp = 100000 + new Random().nextInt(900000);

	    user.setResetOtp(otp);
	    user.setResetOtpExpiry(LocalDateTime.now().plusMinutes(5));

	    userRepository.save(user);

	    SimpleMailMessage message = new SimpleMailMessage();
	    message.setTo(user.getEmail());
	    message.setSubject("SalesSavvy Password Reset OTP");
	    message.setText("Your password reset OTP is: " + otp + "\n\nThis OTP is valid for 5 minutes.");

	    mailSender.send(message);

	    return "OTP sent successfully";
	}
	
	
	@Override
	public String verifyResetOtp(String email, Integer otp) {

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    if (!user.getResetOtp().equals(otp)) {
	        throw new RuntimeException("Invalid OTP");
	    }

	    if (user.getResetOtpExpiry().isBefore(LocalDateTime.now())) {
	        throw new RuntimeException("OTP has expired");
	    }

	    return "OTP verified successfully";
	}
	
	
	@Override
	public String resetPassword(String email, String newPassword) {

	    User user = userRepository.findByEmail(email)
	            .orElseThrow(() -> new RuntimeException("User not found"));

	    user.setPassword(bCryptPasswordEncoder.encode(newPassword));

	    // Clear OTP after successful password reset
	    user.setResetOtp(null);
	    user.setResetOtpExpiry(null);

	    userRepository.save(user);

	    return "Password reset successfully";
	}
	
	@Override
	public boolean validateToken(String token) {

	    try {

	        Jwts.parserBuilder()
	                .setSigningKey(SIGNING_KEY)
	                .build()
	                .parseClaimsJws(token);

	        Optional<JWTToken> jwtToken = jwttOkenRepo.findByToken(token);

	        if (jwtToken.isEmpty()) {
	            return false;
	        }

	        return jwtToken.get().getExpiresat().isAfter(LocalDateTime.now());

	    } catch (Exception e) {

	        return false;
	    }
	}
	
	@Override
	public String extractUsername(String token) {

	    return Jwts.parserBuilder()
	            .setSigningKey(SIGNING_KEY)
	            .build()
	            .parseClaimsJws(token)
	            .getBody()
	            .getSubject();
	}
	
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found"));

	    return org.springframework.security.core.userdetails.User
	            .withUsername(user.getUsername())
	            .password(user.getPassword())
	            .authorities("ROLE_" + user.getRole().name())
	            .build();
	}
	

}
