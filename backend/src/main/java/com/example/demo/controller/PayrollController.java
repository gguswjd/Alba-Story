package com.example.demo.controller;

import com.example.demo.dto.request.PayrollCalculateRequest;
import com.example.demo.dto.response.PayrollResponse;
import com.example.demo.service.PayrollService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @Autowired
    private JwtUtil jwtUtil;

    private Long getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("인증이 필요합니다");
    }

    // 급여 계산 (사장: 매장 단위 / 특정 직원 선택 가능)
    @PostMapping("/calculate")
    public ResponseEntity<?> calculate(@Valid @RequestBody PayrollCalculateRequest request) {
        try {
            List<PayrollResponse> result = payrollService.calculateMonthly(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 급여 확정
    @PostMapping("/{payrollId}/finalize")
    public ResponseEntity<?> finalize(@PathVariable Long payrollId) {
        try {
            var payroll = payrollService.finalizePayroll(payrollId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("payrollId", payroll.getPayrollId());
            response.put("finalizedAt", payroll.getFinalizedAt());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 사장: 매장 전체 조회
    @GetMapping("/workplace/{workplaceId}")
    public ResponseEntity<?> workplaceList(@PathVariable Long workplaceId,
                                           @RequestParam int year,
                                           @RequestParam int month) {
        try {
            List<PayrollResponse> result = payrollService.findByWorkplace(workplaceId, year, month);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 알바생: 내 급여 조회
    @GetMapping("/my")
    public ResponseEntity<?> myPayrolls(@RequestParam int year,
                                        @RequestParam int month,
                                        HttpServletRequest request) {
        try {
            Long userId = getUserIdFromToken(request);
            List<PayrollResponse> result = payrollService.findByUser(userId, year, month);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}

