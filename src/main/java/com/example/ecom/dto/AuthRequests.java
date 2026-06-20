package com.example.ecom.dto;

import java.util.Set;

public class AuthRequests {

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}
        public LoginRequest(String email, String password) {
            this.email = email;
            this.password = password;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class RegisterRequest {
        private String email;
        private String password;
        private String phoneNumber;

        public RegisterRequest() {}
        public RegisterRequest(String email, String password, String phoneNumber) {
            this.email = email;
            this.password = password;
            this.phoneNumber = phoneNumber;
        }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getPhoneNumber() { return phoneNumber; }
        public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    }

    public static class AuthResponse {
        private String token;
        private String email;
        private Long userId;
        private Set<String> roles;

        public AuthResponse() {}
        public AuthResponse(String token, String email, Long userId, Set<String> roles) {
            this.token = token;
            this.email = email;
            this.userId = userId;
            this.roles = roles;
        }

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
        public Set<String> getRoles() { return roles; }
        public void setRoles(Set<String> roles) { this.roles = roles; }

        public static AuthResponseBuilder builder() {
            return new AuthResponseBuilder();
        }

        public static class AuthResponseBuilder {
            private String token;
            private String email;
            private Long userId;
            private Set<String> roles;

            public AuthResponseBuilder token(String token) { this.token = token; return this; }
            public AuthResponseBuilder email(String email) { this.email = email; return this; }
            public AuthResponseBuilder userId(Long userId) { this.userId = userId; return this; }
            public AuthResponseBuilder roles(Set<String> roles) { this.roles = roles; return this; }
            public AuthResponse build() {
                return new AuthResponse(token, email, userId, roles);
            }
        }
    }
}
