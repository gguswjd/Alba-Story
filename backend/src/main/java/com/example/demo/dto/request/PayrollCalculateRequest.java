package com.example.demo.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PayrollCalculateRequest {
    private Long workplaceId;
    private Long userId; // null이면 전체 직원
    private Integer year;
    private Integer month;
}

