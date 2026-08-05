package com.salessavvy.app.dto.request;

public class VerifyResetOtpRequest {

    private String email;

    private Integer otp;

    public VerifyResetOtpRequest() {
    }

    public VerifyResetOtpRequest(String email, Integer otp) {
        this.email = email;
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getOtp() {
        return otp;
    }

    public void setOtp(Integer otp) {
        this.otp = otp;
    }

}