package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private UserInfo user;
    private String token; // JWT 토큰 (향후 구현)

    public AuthResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    @Getter
    @Setter
    @AllArgsConstructor
    public static class UserInfo {
        private Long userId;
        private String name;
        private String email;
        private String role;
    }
}
