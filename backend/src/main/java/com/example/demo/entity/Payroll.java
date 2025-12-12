package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payrolls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payroll {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payroll_id")
    private Long payrollId;

    @ManyToOne
    @JoinColumn(name = "workplace_id", nullable = false)
    private Workplace workplace;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "pay_type", nullable = false)
    private PayType payType;

    @Column(name = "work_days")
    private Integer workDays;

    @Column(name = "regular_hours")
    private Float regularHours;

    @Column(name = "overtime_hours")
    private Float overtimeHours;

    @Column(name = "night_hours")
    private Float nightHours;

    @Column(name = "holiday_hours")
    private Float holidayHours;

    @Column(name = "total_hours", nullable = false)
    private Float totalHours;

    @Column(name = "base_pay", precision = 12, scale = 2)
    private BigDecimal basePay;

    @Column(name = "overtime_pay", precision = 12, scale = 2)
    private BigDecimal overtimePay;

    @Column(name = "night_pay", precision = 12, scale = 2)
    private BigDecimal nightPay;

    @Column(name = "holiday_pay", precision = 12, scale = 2)
    private BigDecimal holidayPay;

    @Column(name = "total_pay", nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPay;

    @Column(name = "calculated_at")
    private LocalDateTime calculatedAt;

    @Column(name = "finalized")
    private Boolean finalized = false;

    @Column(name = "finalized_at")
    private LocalDateTime finalizedAt;

    @PrePersist
    protected void onCreate() {
        calculatedAt = LocalDateTime.now();
    }

    public enum PayType {
        HOURLY, WEEKLY, MONTHLY
    }
}
