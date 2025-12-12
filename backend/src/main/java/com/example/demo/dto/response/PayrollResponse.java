package com.example.demo.dto.response;

import com.example.demo.entity.Payroll;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PayrollResponse {
    private Long payrollId;
    private Long userId;
    private Long workplaceId;
    private LocalDate startDate;
    private LocalDate endDate;
    private Payroll.PayType payType;
    private Integer workDays;
    private Float regularHours;
    private Float overtimeHours;
    private Float nightHours;
    private Float holidayHours;
    private Float totalHours;
    private BigDecimal basePay;
    private BigDecimal overtimePay;
    private BigDecimal nightPay;
    private BigDecimal holidayPay;
    private BigDecimal totalPay;
    private Boolean finalized;
    private LocalDateTime calculatedAt;
    private LocalDateTime finalizedAt;
}

