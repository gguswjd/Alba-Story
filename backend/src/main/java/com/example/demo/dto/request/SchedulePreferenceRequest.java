package com.example.demo.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class SchedulePreferenceRequest {
    @NotNull
    private Long workplaceId;

    @Min(2024)
    @Max(2100)
    private int year;

    @Min(1)
    @Max(12)
    private int month;

    // 동일 월 재제출 시 기존 데이터 전체 덮어쓰기 여부 (기본 true)
    private boolean overwrite = true;

    @NotEmpty
    private List<DayPreference> days;

    @Getter
    @Setter
    public static class DayPreference {
        @NotNull
        private LocalDate date; // 예: 2025-01-03

        @NotEmpty
        private List<TimeRange> slots; // 하루에 복수 슬롯 지원
    }

    @Getter
    @Setter
    public static class TimeRange {
        @Pattern(regexp = "^\\d{2}:\\d{2}$", message = "HH:mm 형식이어야 합니다")
        private String startTime;

        @Pattern(regexp = "^\\d{2}:\\d{2}$", message = "HH:mm 형식이어야 합니다")
        private String endTime;
    }
}
