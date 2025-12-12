package com.example.demo.service;

import com.example.demo.dto.request.PayrollCalculateRequest;
import com.example.demo.dto.response.PayrollResponse;
import com.example.demo.entity.Attendance;
import com.example.demo.entity.Payroll;
import com.example.demo.entity.WorkInfo;
import com.example.demo.entity.Workplace;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.PayrollRepository;
import com.example.demo.repository.WorkInfoRepository;
import com.example.demo.repository.WorkplaceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.time.temporal.IsoFields;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PayrollService {

    private static final BigDecimal MULTIPLIER = BigDecimal.valueOf(1.5);

    @Autowired
    private PayrollRepository payrollRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private WorkInfoRepository workInfoRepository;

    @Autowired
    private WorkplaceRepository workplaceRepository;

    @Transactional
    public List<PayrollResponse> calculateMonthly(PayrollCalculateRequest request) {
        LocalDate start = LocalDate.of(request.getYear(), request.getMonth(), 1);
        LocalDate end = start.with(TemporalAdjusters.lastDayOfMonth());

        Workplace workplace = workplaceRepository.findById(request.getWorkplaceId())
                .orElseThrow(() -> new RuntimeException("근무지를 찾을 수 없습니다"));

        List<WorkInfo> targets;
        if (request.getUserId() != null) {
            WorkInfo info = workInfoRepository.findByUserUserIdAndWorkplaceWorkplaceId(request.getUserId(), request.getWorkplaceId())
                    .orElseThrow(() -> new RuntimeException("직원 정보를 찾을 수 없습니다"));
            targets = List.of(info);
        } else {
            targets = workInfoRepository.findByWorkplaceWorkplaceId(request.getWorkplaceId());
        }

        List<PayrollResponse> responses = new ArrayList<>();
        for (WorkInfo info : targets) {
            Payroll payroll = calculateForUser(info, workplace, start, end);
            responses.add(toResponse(payroll));
        }
        return responses;
    }

    @Transactional
    public Payroll finalizePayroll(Long payrollId) {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new RuntimeException("급여 기록을 찾을 수 없습니다"));
        payroll.setFinalized(true);
        payroll.setFinalizedAt(LocalDateTime.now());
        return payrollRepository.save(payroll);
    }

    public List<PayrollResponse> findByWorkplace(Long workplaceId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.with(TemporalAdjusters.lastDayOfMonth());
        return payrollRepository.findByWorkplaceWorkplaceIdAndStartDateAndEndDate(workplaceId, start, end)
                .stream().map(this::toResponse).toList();
    }

    public List<PayrollResponse> findByUser(Long userId, int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.with(TemporalAdjusters.lastDayOfMonth());
        return payrollRepository.findByUserUserIdAndStartDateAndEndDate(userId, start, end)
                .stream().map(this::toResponse).toList();
    }

    private Payroll calculateForUser(WorkInfo workInfo, Workplace workplace, LocalDate start, LocalDate end) {
        List<Attendance> attendances = attendanceRepository
                .findByUserUserIdAndWorkDateBetween(workInfo.getUser().getUserId(), start, end);

        if (attendances.isEmpty()) {
            throw new RuntimeException("해당 기간 출퇴근 기록이 없습니다");
        }

        float totalHours = (float) attendances.stream()
                .mapToDouble(att -> att.getWorkHours() != null ? att.getWorkHours() : 0d)
                .sum();

        Map<LocalDate, Float> dailyHours = attendances.stream()
                .collect(Collectors.toMap(
                        Attendance::getWorkDate,
                        att -> att.getWorkHours() != null ? att.getWorkHours() : 0f
                ));

        float nightHours = sum(attendances.stream().map(Attendance::getNightHours).toList());
        float holidayHours = sum(attendances.stream().map(Attendance::getHolidayHours).toList());

        float overtimeHours = calculateWeeklyOvertime(attendances);
        float regularHours = Math.max(0f, totalHours - overtimeHours);

        int workDays = (int) attendances.stream().filter(a -> a.getCheckOut() != null).count();

        BigDecimal hourly = resolveHourly(workInfo);
        Payroll.PayType payType = resolvePayType(workInfo);
        BigDecimal basePay = resolveBasePay(payType, workInfo, regularHours, hourly);
        BigDecimal overtimePay = hourly.multiply(BigDecimal.valueOf(overtimeHours)).multiply(MULTIPLIER);
        BigDecimal nightPay = hourly.multiply(BigDecimal.valueOf(nightHours)).multiply(MULTIPLIER);
        BigDecimal holidayPay = hourly.multiply(BigDecimal.valueOf(holidayHours)).multiply(MULTIPLIER);
        BigDecimal totalPay = basePay.add(overtimePay).add(nightPay).add(holidayPay);

        Payroll payroll = payrollRepository
                .findByWorkplaceWorkplaceIdAndUserUserIdAndStartDateAndEndDate(workplace.getWorkplaceId(), workInfo.getUser().getUserId(), start, end)
                .orElseGet(Payroll::new);

        payroll.setWorkplace(workplace);
        payroll.setUser(workInfo.getUser());
        payroll.setStartDate(start);
        payroll.setEndDate(end);
        payroll.setPayType(payType);
        payroll.setWorkDays(workDays);
        payroll.setRegularHours(regularHours);
        payroll.setOvertimeHours(overtimeHours);
        payroll.setNightHours(nightHours);
        payroll.setHolidayHours(holidayHours);
        payroll.setTotalHours(totalHours);
        payroll.setBasePay(basePay);
        payroll.setOvertimePay(overtimePay);
        payroll.setNightPay(nightPay);
        payroll.setHolidayPay(holidayPay);
        payroll.setTotalPay(totalPay.setScale(2, RoundingMode.HALF_UP));
        payroll.setCalculatedAt(LocalDateTime.now());
        if (payroll.getFinalized() == null) {
            payroll.setFinalized(false);
        }
        return payrollRepository.save(payroll);
    }

    private float calculateWeeklyOvertime(List<Attendance> attendances) {
        Map<Integer, Double> weekHours = attendances.stream()
                .collect(Collectors.groupingBy(
                        att -> weekKey(att.getWorkDate()),
                        Collectors.summingDouble(att -> att.getWorkHours() != null ? att.getWorkHours() : 0d)
                ));
        return (float) weekHours.values().stream()
                .mapToDouble(h -> Math.max(0, h - 40d))
                .sum();
    }

    private int weekKey(LocalDate date) {
        LocalDate monday = date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        return monday.getYear() * 100 + monday.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR);
    }

    private Payroll.PayType resolvePayType(WorkInfo info) {
        if (info.getPayType() == null) {
            return Payroll.PayType.HOURLY;
        }
        return switch (info.getPayType()) {
            case HOURLY -> Payroll.PayType.HOURLY;
            case WEEKLY -> Payroll.PayType.WEEKLY;
            case MONTHLY -> Payroll.PayType.MONTHLY;
        };
    }

    private BigDecimal resolveHourly(WorkInfo info) {
        if (info.getHourlyWage() != null) return info.getHourlyWage();
        if (info.getWeeklyWage() != null) {
            return info.getWeeklyWage().divide(BigDecimal.valueOf(40), 2, RoundingMode.HALF_UP);
        }
        if (info.getMonthlyWage() != null) {
            // 대략 주40h*4.345주
            return info.getMonthlyWage().divide(BigDecimal.valueOf(40 * 4.345), 2, RoundingMode.HALF_UP);
        }
        throw new RuntimeException("시급 정보를 찾을 수 없습니다");
    }

    private BigDecimal resolveBasePay(Payroll.PayType payType, WorkInfo info, float regularHours, BigDecimal hourly) {
        return switch (payType) {
            case HOURLY -> hourly.multiply(BigDecimal.valueOf(regularHours));
            case WEEKLY -> Optional.ofNullable(info.getWeeklyWage()).orElse(hourly.multiply(BigDecimal.valueOf(regularHours)));
            case MONTHLY -> Optional.ofNullable(info.getMonthlyWage()).orElse(hourly.multiply(BigDecimal.valueOf(regularHours)));
        };
    }

    private float sum(List<Float> floats) {
        return (float) floats.stream().filter(f -> f != null).mapToDouble(Float::doubleValue).sum();
    }

    private PayrollResponse toResponse(Payroll payroll) {
        return new PayrollResponse(
                payroll.getPayrollId(),
                payroll.getUser().getUserId(),
                payroll.getWorkplace().getWorkplaceId(),
                payroll.getStartDate(),
                payroll.getEndDate(),
                payroll.getPayType(),
                payroll.getWorkDays(),
                payroll.getRegularHours(),
                payroll.getOvertimeHours(),
                payroll.getNightHours(),
                payroll.getHolidayHours(),
                payroll.getTotalHours(),
                payroll.getBasePay(),
                payroll.getOvertimePay(),
                payroll.getNightPay(),
                payroll.getHolidayPay(),
                payroll.getTotalPay(),
                payroll.getFinalized(),
                payroll.getCalculatedAt(),
                payroll.getFinalizedAt()
        );
    }
}

