package com.resumematcher.resumematcher.dto;

import lombok.Data;

//Data Transfer Object - what React sends to /auth/login
@Data
public class LoginRequest {
 private String email;
 private String password;
public LoginRequest() {
	super();
	// TODO Auto-generated constructor stub
}
public LoginRequest(String email, String password) {
	super();
	this.email = email;
	this.password = password;
}
public String getEmail() {
	return email;
}
public void setEmail(String email) {
	this.email = email;
}
public String getPassword() {
	return password;
}
public void setPassword(String password) {
	this.password = password;
}

}
