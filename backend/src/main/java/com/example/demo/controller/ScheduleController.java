package com.example.demo.controller;

import com.example.demo.dto.request.ScheduleGenerateRequest;
import com.example.demo.dto.request.SchedulePreferenceRequest;
import com.example.demo.entity.Schedule;
import com.example.demo.service.ScheduleService;
import com.example.demo.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

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

    // 알바생: 선호도 등록
    @PostMapping("/preference")
    public ResponseEntity<?> savePreference(@Valid @RequestBody SchedulePreferenceRequest request, HttpServletRequest httpRequest) {
        try {
            Long userId = getUserIdFromToken(httpRequest);
            var saved = scheduleService.saveSchedulePreference(userId, request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "선호도가 저장되었습니다");
            response.put("preferenceId", saved.getPreferenceId());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 사장: AI 스케줄 생성
    @PostMapping("/generate")
    public ResponseEntity<?> generateSchedule(@Valid @RequestBody ScheduleGenerateRequest request) {
        try {
            List<Schedule> schedules = scheduleService.generateOptimalSchedule(request);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "스케줄이 생성되었습니다");
            response.put("schedules", schedules);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 스케줄 수정
    @PutMapping("/{scheduleId}")
    public ResponseEntity<?> updateSchedule(
            @PathVariable Long scheduleId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startTime,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endTime) {
        try {
            Schedule schedule = scheduleService.updateSchedule(scheduleId, startTime, endTime);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "스케줄이 수정되었습니다");
            response.put("schedule", schedule);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 스케줄 삭제
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long scheduleId) {
        try {
            scheduleService.deleteSchedule(scheduleId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "스케줄이 삭제되었습니다");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("success", "false");
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 근무지 스케줄 조회
    @GetMapping("/workplace/{workplaceId}")
    public ResponseEntity<?> getSchedulesByWorkplace(@PathVariable Long workplaceId) {
        try {
            List<Schedule> schedules = scheduleService.getSchedulesByWorkplace(workplaceId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // 내 스케줄 조회
    @GetMapping("/my")
    public ResponseEntity<?> getMySchedules(HttpServletRequest request) {
        try {
            Long userId = getUserIdFromToken(request);
            List<Schedule> schedules = scheduleService.getSchedulesByUser(userId);
            return ResponseEntity.ok(schedules);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}
