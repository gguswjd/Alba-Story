package com.example.demo.repository;

import com.example.demo.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByWorkplaceWorkplaceId(Long workplaceId);
    List<Attendance> findByUserUserId(Long userId);
    List<Attendance> findByWorkplaceWorkplaceIdAndUserUserId(Long workplaceId, Long userId);
    Optional<Attendance> findByWorkplaceWorkplaceIdAndUserUserIdAndWorkDate(Long workplaceId, Long userId, LocalDate workDate);
}
