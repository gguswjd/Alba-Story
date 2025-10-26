package com.example.demo.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CheckInRequest {
    private Long workplaceId;
    private LocalDate workDate; // 선택사항, null이면 오늘 날짜
}
