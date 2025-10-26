package com.example.demo.repository;

import com.example.demo.entity.Workplace;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkplaceRepository extends JpaRepository<Workplace, Long> {
    List<Workplace> findByUserUserId(Long userId);
}
