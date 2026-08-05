package com.salessavvy.app.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "otp_verification")
public class OTPVerification {
	
	 	@Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;

	    @Column(name = "otp_value")
	    private int otpValue;

	    @Column(name = "created_at")
	    private LocalDateTime createdAt;

	    @ManyToOne
	    @JoinColumn(name = "user_id")
	    private User user;
	    
	    public OTPVerification() {
			
		}

		public OTPVerification(int id, int otpValue, LocalDateTime createdAt, User user) {
			super();
			this.id = id;
			this.otpValue = otpValue;
			this.createdAt = createdAt;
			this.user = user;
		}

		public OTPVerification(int otpValue, LocalDateTime createdAt, User user) {
			super();
			this.otpValue = otpValue;
			this.createdAt = createdAt;
			this.user = user;
		}

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public int getOtpValue() {
			return otpValue;
		}

		public void setOtpValue(int otpValue) {
			this.otpValue = otpValue;
		}

		public LocalDateTime getCreatedAt() {
			return createdAt;
		}

		public void setCreatedAt(LocalDateTime createdAt) {
			this.createdAt = createdAt;
		}

		public User getUser() {
			return user;
		}

		public void setUser(User user) {
			this.user = user;
		}
	    
	    
	    
	    

}
