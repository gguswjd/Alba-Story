package com.example.demo.repository;

import com.example.demo.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {
    List<Schedule> findByWorkplaceWorkplaceId(Long workplaceId);
    List<Schedule> findByUserUserId(Long userId);
    List<Schedule> findByWorkplaceWorkplaceIdAndUserUserId(Long workplaceId, Long userId);
}
