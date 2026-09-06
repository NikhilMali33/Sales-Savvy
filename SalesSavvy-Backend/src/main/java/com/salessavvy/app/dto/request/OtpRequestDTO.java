package com.salessavvy.app.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public class OtpRequestDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @Min(value = 100000, message = "OTP must be a 6-digit number")
    @Max(value = 999999, message = "OTP must be a 6-digit number")
    private int otp;

    public OtpRequestDTO() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public int getOtp() {
        return otp;
    }

    public void setOtp(int otp) {
        this.otp = otp;
    }
}