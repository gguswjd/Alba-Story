package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "work_infos")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WorkInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "info_id")
    private Long infoId;

    @ManyToOne
    @JoinColumn(name = "workplace_id", nullable = false)
    private Workplace workplace;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(length = 100)
    private String position;

    @Column(name = "open_time")
    private LocalTime openTime;

    @Column(name = "close_time")
    private LocalTime closeTime;

    @Column(name = "hourly_wage", precision = 10, scale = 2)
    private BigDecimal hourlyWage;

    @Enumerated(EnumType.STRING)
    @Column(name = "pay_type")
    private PayType payType = PayType.HOURLY; // 기본 시급제

    @Column(name = "weekly_wage", precision = 12, scale = 2)
    private BigDecimal weeklyWage; // 주급제 사용 시

    @Column(name = "monthly_wage", precision = 12, scale = 2)
    private BigDecimal monthlyWage; // 월급제 사용 시

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum PayType {
        HOURLY, WEEKLY, MONTHLY
    }
}
