package com.example.demo.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class SchedulePreferenceRequest {
    private Long workplaceId;
    private List<String> availableDays; // ["월", "화", "수", "목", "금", "토", "일"]
    private String preferredStartTime; // "09:00"
    private String preferredEndTime; // "18:00"
    private Integer minHoursPerWeek; // 주당 최소 근무 시간
    private Integer maxHoursPerWeek; // 주당 최대 근무 시간
}
