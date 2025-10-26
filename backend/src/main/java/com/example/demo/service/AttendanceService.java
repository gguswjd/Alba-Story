package com.example.demo.service;

import com.example.demo.dto.request.AttendanceCreateRequest;
import com.example.demo.dto.response.AttendanceResponse;
import com.example.demo.entity.Attendance;
import com.example.demo.entity.User;
import com.example.demo.entity.Workplace;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.WorkplaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkplaceRepository workplaceRepository;

    // 알바생 출근 체크
    @Transactional
    public Attendance checkIn(Long userId, Long workplaceId, LocalDate workDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Workplace workplace = workplaceRepository.findById(workplaceId)
                .orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));

        LocalDate date = (workDate != null) ? workDate : LocalDate.now();

        // 오늘 이미 출근 기록이 있는지 확인
        attendanceRepository.findByWorkplaceWorkplaceIdAndUserUserIdAndWorkDate(workplaceId, userId, date)
                .ifPresent(attendance -> {
                    if (attendance.getCheckIn() != null) {
                        throw new RuntimeException("이미 출근 기록이 있습니다");
                    }
                });

        Attendance attendance = attendanceRepository
                .findByWorkplaceWorkplaceIdAndUserUserIdAndWorkDate(workplaceId, userId, date)
                .orElseGet(() -> {
                    Attendance newAttendance = new Attendance();
                    newAttendance.setUser(user);
                    newAttendance.setWorkplace(workplace);
                    newAttendance.setWorkDate(date);
                    newAttendance.setApproved(false);
                    return newAttendance;
                });

        attendance.setCheckIn(LocalDateTime.now());
        return attendanceRepository.save(attendance);
    }

    // 알바생 퇴근 체크
    @Transactional
    public Attendance checkOut(Long userId, Long workplaceId, LocalDate workDate) {
        LocalDate date = (workDate != null) ? workDate : LocalDate.now();

        Attendance attendance = attendanceRepository
                .findByWorkplaceWorkplaceIdAndUserUserIdAndWorkDate(workplaceId, userId, date)
                .orElseThrow(() -> new RuntimeException("출근 기록을 찾을 수 없습니다"));

        if (attendance.getCheckIn() == null) {
            throw new RuntimeException("출근 기록이 없습니다");
        }

        if (attendance.getCheckOut() != null) {
            throw new RuntimeException("이미 퇴근 기록이 있습니다");
        }

        attendance.setCheckOut(LocalDateTime.now());

        // 근무 시간 계산
        long hours = ChronoUnit.HOURS.between(attendance.getCheckIn(), attendance.getCheckOut());
        long minutes = ChronoUnit.MINUTES.between(attendance.getCheckIn(), attendance.getCheckOut()) % 60;
        float workHours = hours + (minutes / 60.0f);
        attendance.setWorkHours(workHours);

        return attendanceRepository.save(attendance);
    }

    // 사장: 출퇴근 기록 생성
    @Transactional
    public Attendance createAttendance(AttendanceCreateRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다"));

        Workplace workplace = workplaceRepository.findById(request.getWorkplaceId())
                .orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));

        // 이미 기록이 있는지 확인
        if (attendanceRepository
                .findByWorkplaceWorkplaceIdAndUserUserIdAndWorkDate(request.getWorkplaceId(), request.getUserId(), request.getWorkDate())
                .isPresent()) {
            throw new RuntimeException("해당 날짜의 기록이 이미 존재합니다");
        }

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setWorkplace(workplace);
        attendance.setWorkDate(request.getWorkDate());
        attendance.setCheckIn(request.getCheckIn());
        attendance.setCheckOut(request.getCheckOut());
        attendance.setApproved(true); // 사장이 만든 기록은 자동 승인

        // 근무 시간 계산
        if (request.getCheckIn() != null && request.getCheckOut() != null) {
            long hours = ChronoUnit.HOURS.between(request.getCheckIn(), request.getCheckOut());
            long minutes = ChronoUnit.MINUTES.between(request.getCheckIn(), request.getCheckOut()) % 60;
            float workHours = hours + (minutes / 60.0f);
            attendance.setWorkHours(workHours);
        }

        return attendanceRepository.save(attendance);
    }

    // 사장: 출퇴근 기록 수정
    @Transactional
    public Attendance updateAttendance(Long attendanceId, LocalDateTime checkIn, LocalDateTime checkOut) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("출퇴근 기록을 찾을 수 없습니다"));

        attendance.setCheckIn(checkIn);
        attendance.setCheckOut(checkOut);
        attendance.setApproved(true);

        // 근무 시간 재계산
        if (checkIn != null && checkOut != null) {
            long hours = ChronoUnit.HOURS.between(checkIn, checkOut);
            long minutes = ChronoUnit.MINUTES.between(checkIn, checkOut) % 60;
            float workHours = hours + (minutes / 60.0f);
            attendance.setWorkHours(workHours);
        }

        return attendanceRepository.save(attendance);
    }

    // 출퇴근 기록 조회 (근무지별)
    public List<AttendanceResponse> getAttendancesByWorkplace(Long workplaceId) {
        List<Attendance> attendances = attendanceRepository.findByWorkplaceWorkplaceId(workplaceId);
        
        return attendances.stream()
                .map(att -> new AttendanceResponse(
                        att.getAttendanceId(),
                        att.getUser().getUserId(),
                        att.getUser().getName(),
                        att.getWorkplace().getWorkplaceId(),
                        att.getWorkplace().getWorkName(),
                        att.getWorkDate(),
                        att.getCheckIn(),
                        att.getCheckOut(),
                        att.getWorkHours(),
                        att.getApproved()
                ))
                .collect(Collectors.toList());
    }

    // 출퇴근 기록 조회 (사용자별)
    public List<AttendanceResponse> getAttendancesByUser(Long userId) {
        List<Attendance> attendances = attendanceRepository.findByUserUserId(userId);
        
        return attendances.stream()
                .map(att -> new AttendanceResponse(
                        att.getAttendanceId(),
                        att.getUser().getUserId(),
                        att.getUser().getName(),
                        att.getWorkplace().getWorkplaceId(),
                        att.getWorkplace().getWorkName(),
                        att.getWorkDate(),
                        att.getCheckIn(),
                        att.getCheckOut(),
                        att.getWorkHours(),
                        att.getApproved()
                ))
                .collect(Collectors.toList());
    }

    // 출퇴근 기록 승인
    @Transactional
    public Attendance approveAttendance(Long attendanceId) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("출퇴근 기록을 찾을 수 없습니다"));
        
        attendance.setApproved(true);
        return attendanceRepository.save(attendance);
    }
}
