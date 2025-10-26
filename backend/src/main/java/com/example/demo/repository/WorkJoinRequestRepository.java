package com.example.demo.repository;

import com.example.demo.entity.WorkJoinRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkJoinRequestRepository extends JpaRepository<WorkJoinRequest, Long> {
    List<WorkJoinRequest> findByWorkplaceWorkplaceId(Long workplaceId);
    List<WorkJoinRequest> findByUserUserId(Long userId);
    Optional<WorkJoinRequest> findByUserUserIdAndWorkplaceWorkplaceId(Long userId, Long workplaceId);
}
