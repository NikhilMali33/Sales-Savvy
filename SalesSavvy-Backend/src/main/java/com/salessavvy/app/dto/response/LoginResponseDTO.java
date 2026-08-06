package com.salessavvy.app.dto.response;

public class LoginResponseDTO {

    private String message;

    private String token;

    private UserResponseDTO user;

    public LoginResponseDTO() {
    }

    public LoginResponseDTO(
            String message,
            String token,
            UserResponseDTO user) {

        this.message = message;
        this.token = token;
        this.user = user;

    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public UserResponseDTO getUser() {
        return user;
    }

    public void setUser(UserResponseDTO user) {
        this.user = user;
    }

}