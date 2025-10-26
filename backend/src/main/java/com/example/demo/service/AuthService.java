package com.example.demo.service;

import com.example.demo.dto.request.LoginRequest;
import com.example.demo.dto.request.SignupRequest;
import com.example.demo.dto.response.AuthResponse;
import com.example.demo.entity.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 회원가입
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        // 이메일 중복 확인
        if (userRepository.existsByEmail(request.getEmail())) {
            return new AuthResponse(false, "이미 사용 중인 이메일입니다");
        }

        // 역할 검증
        try {
            User.UserRole role = User.UserRole.valueOf(request.getRole());
        } catch (IllegalArgumentException e) {
            return new AuthResponse(false, "유효하지 않은 역할입니다");
        }

        // 새 사용자 생성
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole(User.UserRole.valueOf(request.getRole()));

        User savedUser = userRepository.save(user);

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(savedUser);

        return new AuthResponse(
            true,
            "회원가입이 완료되었습니다",
            new AuthResponse.UserInfo(
                savedUser.getUserId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getRole().name()
            ),
            token
        );
    }

    // 로그인
    public AuthResponse login(LoginRequest request) {
        // 사용자 찾기
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        
        if (userOpt.isEmpty()) {
            return new AuthResponse(false, "이메일 또는 비밀번호가 올바르지 않습니다");
        }

        User user = userOpt.get();

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return new AuthResponse(false, "이메일 또는 비밀번호가 올바르지 않습니다");
        }

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user);

        return new AuthResponse(
            true,
            "로그인 성공",
            new AuthResponse.UserInfo(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name()
            ),
            token
        );
    }
}
