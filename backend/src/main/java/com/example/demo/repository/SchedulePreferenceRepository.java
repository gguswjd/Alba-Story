package com.example.demo.repository;

import com.example.demo.entity.SchedulePreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface SchedulePreferenceRepository extends JpaRepository<SchedulePreference, Long> {
    Optional<SchedulePreference> findByUserUserIdAndWorkplaceWorkplaceIdAndTargetMonth(Long userId, Long workplaceId, LocalDate targetMonth);
}

