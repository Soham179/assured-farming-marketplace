package com.assuredfarming.app.service;

import com.assuredfarming.app.model.User;
import com.assuredfarming.app.model.UserStatus;
import com.assuredfarming.app.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE user with password encoding
    public User createUser(User user) {
        System.out.println("🔐 Encoding password for new user");
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        if (user.getStatus() == null) {
            user.setStatus(UserStatus.ACTIVE);
        }

        User savedUser = userRepository.save(user);
        System.out.println("💾 User saved: " + savedUser.getEmail());
        return savedUser;
    }

    // GET all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // ✅ GET user by ID (needed by ProductController)
    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    // GET user by email
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // UPDATE user details (password re-encoded if changed)
    public User updateUser(User user) {
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return userRepository.save(user);
    }

    // DELETE user by ID
    public void deleteUser(Integer id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        }
    }

    // CHECK if email exists
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    // UPDATE user status
    public User updateUserStatus(Integer userId, UserStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        return userRepository.save(user);
    }

    // HELPER: Print all users with passwords (for debugging only)
    public void printAllUsersWithPasswords() {
        List<User> users = userRepository.findAll();
        System.out.println("📊 === ALL USERS ===");
        for (User u : users) {
            System.out.println("ID: " + u.getUserId() +
                    ", Email: " + u.getEmail() +
                    ", Password: " + u.getPassword() +
                    ", Is BCrypt: " + (u.getPassword() != null && u.getPassword().startsWith("$2a$")));
        }
        System.out.println("📊 === END ===");
    }
}
