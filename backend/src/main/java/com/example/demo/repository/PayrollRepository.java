package com.example.demo.repository;

import com.example.demo.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    Optional<Payroll> findByWorkplaceWorkplaceIdAndUserUserIdAndStartDateAndEndDate(Long workplaceId, Long userId, LocalDate startDate, LocalDate endDate);
    List<Payroll> findByWorkplaceWorkplaceIdAndStartDateAndEndDate(Long workplaceId, LocalDate startDate, LocalDate endDate);
    List<Payroll> findByUserUserIdAndStartDateAndEndDate(Long userId, LocalDate startDate, LocalDate endDate);
}

