package com.resumematcher.resumematcher.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

// What we send back to React after successful login or register
@Data
@AllArgsConstructor
public class AuthResponse {

    private String token;    // JWT token - React stores this
    private Long   userId;   // User's DB id
    private String name;     // e.g. "Ankita Sharma"
    private String email;    // e.g. "ankita@example.com"
    private String message;  // e.g. "Login successful"
	
    public AuthResponse() {
		super();
		// TODO Auto-generated constructor stub
	}
	public String getToken() {
		return token;
	}
	public void setToken(String token) {
		this.token = token;
	}
	public Long getUserId() {
		return userId;
	}
	public void setUserId(Long userId) {
		this.userId = userId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
}
