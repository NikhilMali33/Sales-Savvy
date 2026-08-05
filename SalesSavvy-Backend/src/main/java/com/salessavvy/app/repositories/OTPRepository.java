package com.salessavvy.app.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.salessavvy.app.entities.OTPVerification;
import com.salessavvy.app.entities.User;



public interface OTPRepository extends JpaRepository<OTPVerification, Integer>{
	
	OTPVerification findByOtpValue(int otpValue);

    OTPVerification findByUser(User user);

}
