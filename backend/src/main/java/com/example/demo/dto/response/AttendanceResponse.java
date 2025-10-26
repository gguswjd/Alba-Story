package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class AttendanceResponse {
    private Long attendanceId;
    private Long userId;
    private String userName;
    private Long workplaceId;
    private String workplaceName;
    private LocalDate workDate;
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
    private Float workHours;
    private Boolean approved;
}
