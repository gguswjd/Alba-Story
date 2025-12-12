package com.example.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
public class PostResponse {
    private Long postId;
    private String board; // "tip" or "review"
    private Long userId;
    private String userName;
    private Long workplaceId; // 리뷰 게시판 용
    private String title;
    private String content;
    private Integer likes;
    private Integer dislikes;
    private Integer views;
    private LocalDateTime createdAt;
}

