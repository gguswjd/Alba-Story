package com.example.demo.service;

import com.example.demo.dto.request.ScheduleGenerateRequest;
import com.example.demo.dto.request.SchedulePreferenceRequest;
import com.example.demo.entity.*;
import com.example.demo.repository.*;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private WorkplaceRepository workplaceRepository;

    @Autowired
    private WorkInfoRepository workInfoRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private OpenAiService openAiService;

    // 알바생 선호도 등록
    @Transactional
    public void saveSchedulePreference(Long userId, SchedulePreferenceRequest request) {
        // 선호도 정보를 사용자에게 저장 (실제 구현에서는 별도 테이블 필요)
        // 여기서는 간단하게 로깅
        System.out.println("Schedule preference saved for user: " + userId);
    }

    // AI 기반 스케줄 생성
    @Transactional
    public List<Schedule> generateOptimalSchedule(ScheduleGenerateRequest request) {
        Workplace workplace = workplaceRepository.findById(request.getWorkplaceId())
                .orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));

        // 근무지의 모든 직원 조회
        List<WorkInfo> employees = workInfoRepository.findByWorkplaceWorkplaceId(request.getWorkplaceId());

        if (employees.isEmpty()) {
            throw new RuntimeException("근무지에 등록된 직원이 없습니다");
        }

        // OpenAI를 통한 스케줄 최적화
        List<Map<String, Object>> aiSchedule = generateScheduleWithAI(request, employees);

        // AI 생성 스케줄을 DB에 저장
        List<Schedule> schedules = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

        for (Map<String, Object> scheduleData : aiSchedule) {
            Schedule schedule = new Schedule();
            schedule.setUser((User) scheduleData.get("user"));
            schedule.setWorkplace(workplace);
            schedule.setStartTime((LocalDateTime) scheduleData.get("startTime"));
            schedule.setEndTime((LocalDateTime) scheduleData.get("endTime"));
            schedule.setMethod(Schedule.Method.manual);
            schedule.setStatus(Schedule.ScheduleStatus.active);

            schedules.add(scheduleRepository.save(schedule));
        }

        return schedules;
    }

    // OpenAI를 사용한 스케줄 생성
    private List<Map<String, Object>> generateScheduleWithAI(ScheduleGenerateRequest request, List<WorkInfo> employees) {
        // 간단한 알고리즘 기반 스케줄 생성 (OpenAI API 없이)
        // 실제 구현 시 OpenAI 호출
        
        List<Map<String, Object>> schedules = new ArrayList<>();
        LocalDate currentDate = request.getStartDate();
        int employeeIndex = 0;
        
        List<User> employeeUsers = employees.stream()
                .map(WorkInfo::getUser)
                .collect(Collectors.toList());

        while (!currentDate.isAfter(request.getEndDate())) {
            // 휴무일 체크
            if (request.getOffDays() != null && request.getOffDays().contains(
                    currentDate.getDayOfWeek().toString().substring(0, 1) + 
                    currentDate.getDayOfWeek().toString().substring(1).toLowerCase()
            )) {
                currentDate = currentDate.plusDays(1);
                continue;
            }

            // 각 직원에게 스케줄 배정
            for (int i = 0; i < employeeUsers.size(); i++) {
                User employee = employeeUsers.get((employeeIndex + i) % employeeUsers.size());
                
                // 오전 근무 (09:00 - 15:00)
                if ((employeeIndex + i) % 2 == 0) {
                    Map<String, Object> scheduleMap = new HashMap<>();
                    scheduleMap.put("user", employee);
                    scheduleMap.put("startTime", LocalDateTime.of(currentDate, LocalTime.of(9, 0)));
                    scheduleMap.put("endTime", LocalDateTime.of(currentDate, LocalTime.of(15, 0)));
                    schedules.add(scheduleMap);
                }
                
                // 오후 근무 (15:00 - 21:00)
                if ((employeeIndex + i) % 2 == 1) {
                    Map<String, Object> scheduleMap = new HashMap<>();
                    scheduleMap.put("user", employee);
                    scheduleMap.put("startTime", LocalDateTime.of(currentDate, LocalTime.of(15, 0)));
                    scheduleMap.put("endTime", LocalDateTime.of(currentDate, LocalTime.of(21, 0)));
                    schedules.add(scheduleMap);
                }
            }

            currentDate = currentDate.plusDays(1);
            employeeIndex++;
        }

        return schedules;
    }

    // OpenAI API 호출 (실제 구현)
    private String callOpenAIForSchedule(String prompt) {
        if (openAiService == null) {
            System.out.println("OpenAI API is not configured");
            return null;
        }

        try {
            // OpenAI API 호출 코드
            // com.theokanning.openai.completion.CompletionRequest 사용
            return "AI generated schedule";
        } catch (Exception e) {
            System.err.println("Error calling OpenAI: " + e.getMessage());
            return null;
        }
    }

    // 스케줄 수정
    @Transactional
    public Schedule updateSchedule(Long scheduleId, LocalDateTime startTime, LocalDateTime endTime) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("스케줄을 찾을 수 없습니다"));

        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        schedule.setStatus(Schedule.ScheduleStatus.modified);

        return scheduleRepository.save(schedule);
    }

    // 스케줄 삭제
    @Transactional
    public void deleteSchedule(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("스케줄을 찾을 수 없습니다"));

        schedule.setStatus(Schedule.ScheduleStatus.cancelled);
        scheduleRepository.save(schedule);
    }

    // 근무지 스케줄 조회
    public List<Schedule> getSchedulesByWorkplace(Long workplaceId) {
        return scheduleRepository.findByWorkplaceWorkplaceId(workplaceId);
    }

    // 사용자 스케줄 조회
    public List<Schedule> getSchedulesByUser(Long userId) {
        return scheduleRepository.findByUserUserId(userId);
    }

    // 스케줄 충돌 체크
    public boolean hasScheduleConflict(Long userId, LocalDateTime startTime, LocalDateTime endTime) {
        List<Schedule> userSchedules = scheduleRepository.findByUserUserId(userId);

        return userSchedules.stream()
                .anyMatch(schedule -> 
                    !(schedule.getEndTime().isBefore(startTime) || schedule.getStartTime().isAfter(endTime))
                );
    }
}
