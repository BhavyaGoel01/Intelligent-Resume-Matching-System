package com.resumematcher.resumematcher.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Full name e.g. "Ankita Sharma"
    private String name;

    // Must be unique - used for login
    @Column(unique = true, nullable = false)
    private String email;

    // Stored as BCrypt hash - NEVER plain text
    @Column(nullable = false)
    private String password;

    // When the user registered
    private String createdAt;

	public User(String name, String email, String password, String createdAt) {
		super();
		this.name = name;
		this.email = email;
		this.password = password;
		this.createdAt = createdAt;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
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

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}
    
}