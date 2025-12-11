package com.example.demo.controller;

import com.example.demo.dto.request.WorkplaceCreateRequest;
import com.example.demo.dto.response.WorkJoinRequestResponse;
import com.example.demo.entity.WorkJoinRequest;
import com.example.demo.entity.Workplace;
import com.example.demo.service.WorkplaceService;
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
@RequestMapping("/api/workplace")
public class WorkplaceController {

    @Autowired
    private WorkplaceService workplaceService;

    @Autowired
    private JwtUtil jwtUtil;

    // 현재 사용자 ID 추출
    private Long getUserIdFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        throw new RuntimeException("인증이 필요합니다");
    }

    // 근무지 생성
    @PostMapping
    public ResponseEntity<?> createWorkplace(@Valid @RequestBody WorkplaceCreateRequest request, HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            Workplace workplace = workplaceService.createWorkplace(userId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "근무지가 생성되었습니다");
            response.put("workplace", workplace);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 근무지 가입 신청
    @PostMapping("/join")
    public ResponseEntity<?> applyToWorkplace(@RequestParam Long workplaceId, HttpServletRequest request) {
        try {
            Long userId = getUserIdFromToken(request);
            WorkJoinRequest joinRequest = workplaceService.applyToWorkplace(userId, workplaceId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "가입 신청이 완료되었습니다");
            response.put("request", joinRequest);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 가입 신청 목록 조회 (근무지 주인)
    @GetMapping("/{workplaceId}/requests")
    public ResponseEntity<?> getJoinRequests(@PathVariable Long workplaceId) {
        try {
            List<WorkJoinRequestResponse> requests = workplaceService.getJoinRequestsByWorkplace(workplaceId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 가입 신청 처리 (승인/거절) - 확장 버전
    @PostMapping("/requests/{requestId}/respond")
    public ResponseEntity<?> respondToJoinRequest(
            @PathVariable Long requestId, 
            @RequestParam boolean approved,
            @RequestParam(required = false) String position,
            @RequestParam(required = false) Integer hourlyWage) {
        try {
            WorkJoinRequest request = workplaceService.respondToJoinRequest(requestId, approved, position, hourlyWage);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", approved ? "가입 신청이 승인되었습니다" : "가입 신청이 거절되었습니다");
            response.put("request", request);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
    
    // 운영 시간 설정
    @PostMapping("/{workplaceId}/hours")
    public ResponseEntity<?> setOperatingHours(@PathVariable Long workplaceId, 
                                               @RequestParam String openTime,
                                               @RequestParam String closeTime) {
        try {
            // 구현 필요
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "운영 시간이 설정되었습니다");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 근무 정보 업데이트 (직급, 시급)
    @PutMapping("/{workplaceId}/employees/{userId}")
    public ResponseEntity<?> updateWorkInfo(@PathVariable Long workplaceId,
                                           @PathVariable Long userId,
                                           @RequestParam(required = false) String position,
                                           @RequestParam(required = false) Integer hourlyWage) {
        try {
            var workInfo = workplaceService.updateWorkInfo(userId, workplaceId, position, hourlyWage);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "근무 정보가 업데이트되었습니다");
            response.put("workInfo", workInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 근무지 직원 삭제 (퇴사 처리)
    @DeleteMapping("/{workplaceId}/employees/{userId}")
    public ResponseEntity<?> removeEmployee(@PathVariable Long workplaceId,
                                           @PathVariable Long userId) {
        try {
            workplaceService.removeEmployeeFromWorkplace(userId, workplaceId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "직원이 삭제되었습니다");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 근무지 직원 목록 조회
    @GetMapping("/{workplaceId}/employees")
    public ResponseEntity<?> getWorkplaceEmployees(@PathVariable Long workplaceId) {
        try {
            var employees = workplaceService.getWorkplaceEmployees(workplaceId);
            return ResponseEntity.ok(employees);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 사용자의 근무지 목록 조회
    @GetMapping("/my")
    public ResponseEntity<?> getMyWorkplaces(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromToken(request);
            List<Workplace> workplaces = workplaceService.getWorkplacesByOwner(userId);
            return ResponseEntity.ok(workplaces);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 전체 근무지 목록 조회
    @GetMapping
    public ResponseEntity<?> getAllWorkplaces() {
        try {
            List<Workplace> workplaces = workplaceService.getAllWorkplaces();
            return ResponseEntity.ok(workplaces);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 근무지 상세 조회 (사장님용)
    @GetMapping("/{workplaceId}")
    public ResponseEntity<?> getWorkplaceDetail(@PathVariable Long workplaceId, HttpServletRequest request) {
        try {
            // 토큰에서 현재 사용자 ID 가져오기
            Long userId = getUserIdFromToken(request);

            // 현재 유저가 owner인 근무지인지 확인하면서 조회
            Workplace workplace = workplaceService.getWorkplaceDetailForOwner(userId, workplaceId);

            return ResponseEntity.ok(workplace);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 직원의 근무지 목록 조회
    @GetMapping("/employee/my")
    public ResponseEntity<?> getMyEmployeeWorkplaces(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromToken(request);
            List<Workplace> workplaces = workplaceService.getWorkplacesByEmployee(userId);
            return ResponseEntity.ok(workplaces);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

}
