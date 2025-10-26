package com.example.demo.repository;

import com.example.demo.entity.WorkInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkInfoRepository extends JpaRepository<WorkInfo, Long> {
    List<WorkInfo> findByWorkplaceWorkplaceId(Long workplaceId);
    List<WorkInfo> findByUserUserId(Long userId);
    Optional<WorkInfo> findByUserUserIdAndWorkplaceWorkplaceId(Long userId, Long workplaceId);
}
