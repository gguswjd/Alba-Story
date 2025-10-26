package com.example.demo.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class ScheduleGenerateRequest {
    private Long workplaceId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer minShiftHours; // 최소 교대 근무 시간
    private Integer maxShiftHours; // 최대 교대 근무 시간
    private Integer restHours; // 휴식 시간
    private List<String> offDays; // 휴무일
}
