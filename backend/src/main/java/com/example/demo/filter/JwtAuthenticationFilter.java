package com.example.demo.filter;

import com.example.demo.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();
        String authHeader = request.getHeader("Authorization");

        log.info("[JwtFilter] start, uri={}", uri);
        log.info("[JwtFilter] Authorization header={}", authHeader);

        // 토큰이 없으면 그냥 다음 필터로 넘김 (익명 요청 허용 구간 때문에)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.info("[JwtFilter] No Bearer token, continue filterChain");
            chain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String email = jwtUtil.extractEmail(jwt);
            final String role = jwtUtil.extractRole(jwt); // e.g. "owner"

            log.info("[JwtFilter] token parsed. email={}, role={}", email, role);

            // 아직 인증정보가 없고, 이메일이 있다면 토큰 검증
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                boolean valid = jwtUtil.validateToken(jwt, email);
                log.info("[JwtFilter] validateToken result={}", valid);

                if (valid) {
                    // 토큰 안에 "owner" 라고 들어있으면 ROLE_OWNER 로 맞춰줌
                    String roleName = (role == null ? "" : role.toUpperCase());
                    SimpleGrantedAuthority authority =
                            new SimpleGrantedAuthority("ROLE_" + roleName);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    null,
                                    Collections.singletonList(authority)
                            );

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("[JwtFilter] Authentication set for {}, authorities={}",
                            email, authToken.getAuthorities());
                } else {
                    log.warn("[JwtFilter] Token validation failed for {}", email);
                    // 토큰이 유효하지 않으면 401로 응답 (필요에 따라 메시지 수정 가능)
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                    return;
                }
            }

            // 정상적으로 통과
            chain.doFilter(request, response);

        } catch (Exception e) {
            // 여기로 들어오면 토큰 파싱/검증 중 예외가 난 것
            log.error("[JwtFilter] JWT 토큰 검증 중 예외 발생, uri=" + uri, e);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "JWT validation error");
        }
    }
}
