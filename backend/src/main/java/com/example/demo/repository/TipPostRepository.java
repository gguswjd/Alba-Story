package com.example.demo.repository;

import com.example.demo.entity.TipPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TipPostRepository extends JpaRepository<TipPost, Long> {
    List<TipPost> findAllByOrderByCreatedAtDesc();
}

