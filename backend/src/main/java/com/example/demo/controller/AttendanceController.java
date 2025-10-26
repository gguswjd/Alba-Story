package com.example.demo.controller;

import com.example.demo.dto.request.AttendanceCreateRequest;
import com.example.demo.dto.response.AttendanceResponse;
import com.example.demo.entity.Attendance;
import com.example.demo.service.AttendanceService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

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

    // 알바생 출근 체크
    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn(@RequestParam Long workplaceId,
                                     @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
                                     HttpServletRequest request) {
        try {
            Long userId = getUserIdFromToken(request);
            Attendance attendance = attendanceService.checkIn(userId, workplaceId, workDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "출근 기록이 등록되었습니다");
            response.put("attendance", attendance);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 알바생 퇴근 체크
    @PostMapping("/check-out")
    public ResponseEntity<?> checkOut(@RequestParam Long workplaceId,
                                      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate workDate,
                                      HttpServletRequest request) {
        try {
            Long userId = getUserIdFromToken(request);
            Attendance attendance = attendanceService.checkOut(userId, workplaceId, workDate);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "퇴근 기록이 등록되었습니다");
            response.put("attendance", attendance);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 사장: 출퇴근 기록 생성
    @PostMapping
    public ResponseEntity<?> createAttendance(@Valid @RequestBody AttendanceCreateRequest request) {
        try {
            Attendance attendance = attendanceService.createAttendance(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "출퇴근 기록이 생성되었습니다");
            response.put("attendance", attendance);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 사장: 출퇴근 기록 수정
    @PutMapping("/{attendanceId}")
    public ResponseEntity<?> updateAttendance(
            @PathVariable Long attendanceId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime checkOut) {
        try {
            Attendance attendance = attendanceService.updateAttendance(attendanceId, checkIn, checkOut);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "출퇴근 기록이 수정되었습니다");
            response.put("attendance", attendance);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 출퇴근 기록 조회 (근무지별)
    @GetMapping("/workplace/{workplaceId}")
    public ResponseEntity<?> getAttendancesByWorkplace(@PathVariable Long workplaceId) {
        try {
            List<AttendanceResponse> attendances = attendanceService.getAttendancesByWorkplace(workplaceId);
            return ResponseEntity.ok(attendances);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 출퇴근 기록 조회 (내 기록)
    @GetMapping("/my")
    public ResponseEntity<?> getMyAttendances(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromToken(request);
            List<AttendanceResponse> attendances = attendanceService.getAttendancesByUser(userId);
            return ResponseEntity.ok(attendances);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 출퇴근 기록 승인
    @PostMapping("/{attendanceId}/approve")
    public ResponseEntity<?> approveAttendance(@PathVariable Long attendanceId) {
        try {
            Attendance attendance = attendanceService.approveAttendance(attendanceId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "출퇴근 기록이 승인되었습니다");
            response.put("attendance", attendance);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
