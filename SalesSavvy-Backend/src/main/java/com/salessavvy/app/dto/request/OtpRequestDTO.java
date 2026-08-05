package com.salessavvy.app.dto.request;

public class OtpRequestDTO {

    private String username;
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