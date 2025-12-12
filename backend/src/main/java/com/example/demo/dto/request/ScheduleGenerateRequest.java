package com.example.demo.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class ScheduleGenerateRequest {
    @NotNull
    private Long workplaceId;

    @NotNull
    private LocalDate startDate;

    @NotNull
    private LocalDate endDate;

    // 영업시간
    @NotNull
    private LocalTime openTime;

    @NotNull
    private LocalTime closeTime;

    // 타임 단위 (시간)
    @Min(1)
    @Max(12)
    private Integer slotHours;

    // 각 타임 최소/최대 인원
    @Min(1)
    private Integer minStaffPerSlot;

    @Min(1)
    private Integer maxStaffPerSlot;

    // 역할 필수 조건
    private List<RoleRequirement> roleRequirements;

    // 특정 알바생 제외
    private List<Long> excludeUserIds;

    // 근무 연속 시간 제한 (시간 단위)
    private Integer maxConsecutiveHours;

    // 휴식, 기타 옵션
    private Integer minShiftHours; // 최소 교대 근무 시간
    private Integer maxShiftHours; // 최대 교대 근무 시간
    private Integer restHours; // 휴식 시간
    private List<String> offDays; // 요일 또는 날짜 문자열

    // 기존 스케줄 덮어쓰기 여부
    private boolean overwriteExisting = true;

    @Getter
    @Setter
    public static class RoleRequirement {
        private String role;      // 예: manager
        private Integer minCount; // 해당 타임에 필요한 최소 인원
        private Integer maxCount; // 선택적: 최대 인원
    }
}
