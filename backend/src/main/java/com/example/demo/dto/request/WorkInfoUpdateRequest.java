package com.example.demo.dto.request;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class WorkInfoUpdateRequest {
    private String position;
    private String openTime;
    private String closeTime;
    private BigDecimal hourlyWage;
}
